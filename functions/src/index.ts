import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Firebase Admin
admin.initializeApp();

/**
 * Configuration for Gemini API
 * Set your Gemini API key in functions/.env file
 */
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

/**
 * Create Gemini client with API key authentication
 */
function createGeminiClient() {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured. Please set GEMINI_API_KEY in functions/.env file');
  }
  
  return new GoogleGenerativeAI(GEMINI_API_KEY);
}

/**
 * Generate career recommendations using Gemini AI
 */
export const generateCareerRecommendations = functions.https.onCall(async (data, context) => {
  try {
    // Verify authentication
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    const { userId } = data;
    if (!userId) {
      throw new functions.https.HttpsError('invalid-argument', 'userId is required');
    }

    // Get user profile from Firestore
    const userDoc = await admin.firestore().collection('users').doc(userId).get();
    if (!userDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'User profile not found');
    }

    const userProfile = userDoc.data();
    if (!userProfile) {
      throw new functions.https.HttpsError('not-found', 'User profile data not found');
    }

    // Prepare the prompt for Gemini
    const systemPrompt = "You are an expert career counselor for students in India in 2025. You understand the modern job market, including tech, creative, and non-traditional roles. Your goal is to provide encouraging, realistic, and actionable advice.";
    
    const userPrompt = `Based on this student's profile:
- Interests: ${userProfile.interests || 'Not specified'}
- Academic Strengths: ${userProfile.academics || 'Not specified'}
- Existing Skills: ${Array.isArray(userProfile.skills) ? userProfile.skills.join(', ') : 'None specified'}

Recommend 4 diverse and suitable career paths. For each path, provide a title, a 2-sentence description, a 1-sentence reasoning for why it's a good fit, and an array of the top 10 most important "Required Skills" for this role.
Focus on roles relevant to the Indian job market. Include a mix of tech and non-tech roles if the profile is broad.

Return your response ONLY as a single, valid JSON object with the following schema:
{
  "careers": [
    {
      "title": "string",
      "description": "string",
      "reasoning": "string",
      "requiredSkills": ["string", "string", ...]
    }
  ]
}`;

    // Call Gemini API using the official SDK
    const genAI = createGeminiClient();
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `${systemPrompt}\n\n${userPrompt}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedText = response.text();
    
    // Parse the JSON response
    let recommendations;
    try {
      recommendations = JSON.parse(generatedText);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      console.error('Raw response:', generatedText);
      throw new functions.https.HttpsError('internal', 'Failed to parse AI response');
    }

    // Save recommendations to user's document
    await admin.firestore().collection('users').doc(userId).update({
      careerRecommendations: recommendations,
      hasGeneratedRecommendations: true,
      lastRecommendationUpdate: admin.firestore.FieldValue.serverTimestamp(),
    });

    functions.logger.info(`Generated career recommendations for user ${userId}`);
    
    return {
      success: true,
      data: recommendations,
    };

  } catch (error) {
    functions.logger.error('Error in generateCareerRecommendations:', error);
    
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    
    throw new functions.https.HttpsError('internal', 'An unexpected error occurred');
  }
});

/**
 * Generate detailed skill roadmap for a specific career using Gemini AI
 */
export const generateSkillRoadmap = functions.https.onCall(async (data, context) => {
  try {
    // Verify authentication
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    const { userId, careerTitle } = data;
    if (!userId || !careerTitle) {
      throw new functions.https.HttpsError('invalid-argument', 'userId and careerTitle are required');
    }

    // Prepare the prompt for Gemini
    const systemPrompt = "You are a specialist in creating detailed learning plans for the Indian market.";
    
    const userPrompt = `Create a detailed, actionable skills roadmap in Markdown format for a student in India aspiring to become a "${careerTitle}".

The roadmap must include these sections:
### 1. Foundational Skills
Core concepts needed.

### 2. Technical Skills
Specific tools, languages, and software.

### 3. Soft Skills
Essential interpersonal abilities.

### 4. Learning Path (Year 1)
Suggest a sequence of learning. Include specific Indian resources like NPTEL or Swayam courses alongside global platforms like Coursera. Suggest 2 practical portfolio projects.

### 5. Top Companies in India
List 5-7 top companies hiring for this role in India (startups and MNCs).

Make the roadmap comprehensive, practical, and tailored for the Indian context.`;

    // Call Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\n${userPrompt}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 1,
          topP: 1,
          maxOutputTokens: 3000,
        }
      })
    });

    if (!response.ok) {
      console.error('Gemini API error:', response.status, response.statusText);
      throw new functions.https.HttpsError('internal', 'Failed to generate roadmap');
    }

    const aiResponse = await response.json();
    
    if (!aiResponse.candidates || aiResponse.candidates.length === 0) {
      throw new functions.https.HttpsError('internal', 'No roadmap generated');
    }

    const roadmapContent = aiResponse.candidates[0].content.parts[0].text;

    // Create roadmap object
    const roadmapData = {
      careerTitle,
      roadmap: roadmapContent,
      generatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    // Save roadmap to user's subcollection (optional - for caching)
    await admin.firestore()
      .collection('users')
      .doc(userId)
      .collection('roadmaps')
      .doc(careerTitle.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase())
      .set(roadmapData);

    functions.logger.info(`Generated skill roadmap for ${careerTitle} for user ${userId}`);
    
    return {
      success: true,
      data: roadmapData,
    };

  } catch (error) {
    functions.logger.error('Error in generateSkillRoadmap:', error);
    
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    
    throw new functions.https.HttpsError('internal', 'An unexpected error occurred');
  }
});

/**
 * Health check endpoint for monitoring
 */
export const healthCheck = functions.https.onRequest((req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'disha-ai-functions'
  });
});
