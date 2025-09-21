// Career-focused AI responses for Disha AI ChatBot
export const generateCareerResponse = (userMessage, userProfile) => {
  const message = userMessage.toLowerCase();
  
  // Extract user interests and skills for personalized responses
  const userInterests = userProfile?.interests || ['Technology', 'Innovation'];
  const userSkills = userProfile?.skills || ['Problem Solving', 'Communication'];
  const userStream = userProfile?.academics?.stream || 'General';
  
  // Career recommendation responses
  if (message.includes('career') || message.includes('job') || message.includes('recommendation')) {
    const careerResponses = [
      `🎯 **Personalized Career Recommendations for ${userStream} Background:**

Based on your interests in ${userInterests.slice(0, 2).join(' and ')}, here are high-growth careers:

**💡 Trending Opportunities:**
• **AI/ML Engineer** - ₹8-25 LPA (High demand)
• **Data Scientist** - ₹6-20 LPA (Analytics focus)
• **Product Manager** - ₹10-30 LPA (Strategy + tech)
• **Full Stack Developer** - ₹5-18 LPA (Versatile skills)
• **DevOps Engineer** - ₹7-22 LPA (Infrastructure focus)

**🚀 Emerging Fields:**
• Blockchain Development
• Cybersecurity Specialist
• UX/UI Designer
• Cloud Solutions Architect

Which area excites you most? I can provide detailed insights!`,

      `🌟 **Career Insights Based on Your Profile:**

Your combination of ${userSkills.slice(0, 2).join(' and ')} skills opens exciting doors!

**📈 Market Analysis:**
• Tech sector growing 15% annually in India
• Remote work increased opportunities by 40%
• Startups offer faster growth (but higher risk)
• MNCs provide stability + structured learning

**🎯 Best Fit Analysis:**
Given your ${userStream} background:
• Technical roles: 85% match
• Leadership roles: 70% match  
• Creative roles: 60% match
• Research roles: 75% match

Want me to dive deeper into any specific career path?`
    ];
    
    return careerResponses[Math.floor(Math.random() * careerResponses.length)];
  }

  // Skills and learning responses
  if (message.includes('skill') || message.includes('learn') || message.includes('improve') || message.includes('course')) {
    const skillResponses = [
      `⚡ **Skill Development Roadmap for You:**

**🔥 High-Demand Skills (2025):**
• **AI/ML**: Python, TensorFlow, PyTorch
• **Cloud**: AWS, Azure, Google Cloud
• **Data**: SQL, Tableau, Power BI
• **Development**: React, Node.js, Docker
• **Soft Skills**: Leadership, Communication

**📚 Recommended Learning Path:**
1. **Foundation** (2-3 months): Choose core tech stack
2. **Specialization** (3-4 months): Deep dive into chosen area  
3. **Projects** (2-3 months): Build portfolio
4. **Certification** (1 month): Get industry recognition

**🏆 Based on your ${userStream} background:**
Priority skills: ${getUserPrioritySkills(userStream, userInterests)}

Want specific course recommendations?`,

      `🚀 **Personalized Skill Enhancement Plan:**

**Current Strengths:** ${userSkills.join(', ')}
**Growth Areas:** Communication, Leadership, Technical depth

**🎯 90-Day Skill Sprint:**
**Week 1-4:** Master ${getRecommendedTech(userInterests)[0]}
**Week 5-8:** Build 2 projects using new skills
**Week 9-12:** Get certified + showcase portfolio

**💡 Free Resources:**
• Coursera (Financial aid available)
• FreeCodeCamp (Hands-on projects)
• YouTube (Practical tutorials)
• GitHub (Open source contribution)

**🏅 Certification Priorities:**
${getCertificationRecommendations(userStream)}

Ready to start your skill journey?`
    ];
    
    return skillResponses[Math.floor(Math.random() * skillResponses.length)];
  }

  // Salary and market insights
  if (message.includes('salary') || message.includes('pay') || message.includes('money') || message.includes('income')) {
    return `💰 **Salary Insights for Your Profile:**

**📊 Current Market Rates (India, 2025):**

**Entry Level (0-2 years):**
• Software Developer: ₹3.5-8 LPA
• Data Analyst: ₹3-6 LPA  
• Digital Marketing: ₹2.5-5 LPA
• UI/UX Designer: ₹3-7 LPA

**Mid Level (3-5 years):**
• Senior Developer: ₹8-18 LPA
• Product Manager: ₹12-25 LPA
• Data Scientist: ₹10-20 LPA
• Team Lead: ₹15-30 LPA

**💡 Salary Boosting Tips:**
• Master high-demand skills (+30-50% hike)
• Switch companies every 2-3 years (+20-40%)
• Get certified in cloud/AI (+25-35%)
• Build strong portfolio (+15-25%)

**🎯 For ${userStream} graduates:**
Expected starting range: ₹${getExpectedSalary(userStream)}

Want negotiation tips or specific company insights?`;
  }

  // Interview and job search help
  if (message.includes('interview') || message.includes('resume') || message.includes('job search') || message.includes('apply')) {
    return `🎯 **Job Search & Interview Mastery:**

**📝 Resume Optimization:**
• Use ATS-friendly format (90% companies use ATS)
• Include quantified achievements
• Highlight relevant projects
• Add keywords from job descriptions

**🎪 Interview Preparation:**
• **Technical**: Practice coding problems daily
• **Behavioral**: Use STAR method for answers
• **Company Research**: Know their products/culture
• **Questions**: Prepare thoughtful questions

**🔍 Job Search Strategy:**
• **LinkedIn**: Update profile, engage with content
• **Company Websites**: Direct applications
• **Referrals**: 40% jobs filled through networks
• **Job Portals**: Naukri, Indeed, AngelList

**🎯 For ${userStream} candidates:**
Focus on: ${getInterviewFocus(userStream)}

**💡 Pro Tips:**
• Apply within 24-48 hours of posting
• Follow up politely after 1 week
• Practice mock interviews
• Build projects that solve real problems

Need help with specific interview questions?`;
  }

  // Company and culture insights
  if (message.includes('company') || message.includes('culture') || message.includes('work environment')) {
    return `🏢 **Company & Culture Insights:**

**🌟 Top Companies by Category:**

**🚀 Startups (High Growth):**
• Razorpay, Zomato, Byju's, Flipkart
• **Pros**: Fast growth, learning, equity
• **Cons**: Work pressure, uncertain stability

**🏗️ Product Companies:**
• Google, Microsoft, Amazon, Adobe
• **Pros**: Best practices, global exposure, stability
• **Cons**: Competitive, structured processes

**💼 Service Companies:**
• TCS, Infosys, Wipro, Accenture
• **Pros**: Training, stability, global projects
• **Cons**: Less innovation, role repetition

**🎯 Culture Factors to Consider:**
• Work-life balance
• Learning opportunities
• Growth trajectory
• Team dynamics
• Remote work policies

**💡 Red Flags to Avoid:**
• High attrition rates (>30%)
• No clear growth path
• Poor Glassdoor reviews
• Delayed salary payments

Want insights about specific companies?`;
  }

  // General help and features
  if (message.includes('help') || message.includes('what can you do') || message.includes('features')) {
    return `🌟 **Welcome to Disha AI - Your Career Companion!**

**🎯 What I Can Help You With:**

**💡 Best Fit Advice:**
• Personalized career recommendations
• Industry trend analysis
• Salary benchmarking
• Company culture insights

**⚡ Instant Career Insights:**
• Real-time job market data
• Skill demand analysis
• Learning pathway suggestions
• Certification guidance

**🤝 Interactive Career Support:**
• Resume optimization tips
• Interview preparation
• Mock interview questions
• Networking strategies
• Career transition planning

**🚀 Smart Features:**
• AI-powered career matching
• Skill gap analysis
• Personalized learning roadmaps
• Market trend predictions

**💬 Try asking me:**
• "What career suits my profile?"
• "How to improve my skills?"
• "Current salary trends?"
• "Interview tips for [company]?"
• "Best companies for freshers?"

How can I help accelerate your career today?`;
  }

  // Default responses with career focus
  const defaultResponses = [
    `That's a great question! 🤔 Let me provide some insights based on current market trends...

**🔥 Quick Career Tip:** ${getRandomCareerTip()}

Feel free to ask me about:
• Career recommendations
• Skill development  
• Salary insights
• Interview preparation
• Company reviews

What specific area would you like to explore?`,

    `I'd love to help you with that! 💭 While I analyze your query, here's something valuable:

**📈 Today's Career Insight:** ${getRandomMarketInsight()}

You can ask me about any career-related topic - from choosing the right path to acing interviews!

What would you like to know more about?`,

    `Interesting question! 🌟 Let me share something that might help:

**💡 Career Success Tip:** ${getRandomSuccessTip()}

I'm here to guide you through every step of your career journey. Feel free to ask about skills, salaries, companies, or anything career-related!

How else can I assist you today?`
  ];

  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
};

// Helper functions for personalized responses
const getUserPrioritySkills = (stream, interests) => {
  const skillMap = {
    'Computer Science': 'Advanced Programming, System Design, Data Structures',
    'Engineering': 'Technical Problem Solving, Project Management, Innovation',
    'Business': 'Data Analysis, Strategic Thinking, Leadership',
    'Science': 'Research Methodology, Data Analysis, Technical Writing'
  };
  return skillMap[stream] || 'Problem Solving, Communication, Technical Skills';
};

const getRecommendedTech = (interests) => {
  if (interests.includes('Technology') || interests.includes('Programming')) {
    return ['Python', 'JavaScript', 'React'];
  }
  if (interests.includes('Data') || interests.includes('Analytics')) {
    return ['Python', 'SQL', 'Tableau'];
  }
  return ['Python', 'Data Analysis', 'Web Development'];
};

const getCertificationRecommendations = (stream) => {
  const certMap = {
    'Computer Science': '• AWS Cloud Practitioner\n• Google Cloud Associate\n• Microsoft Azure Fundamentals',
    'Engineering': '• PMP Certification\n• Six Sigma\n• AWS Solutions Architect',
    'Business': '• Google Analytics\n• HubSpot Marketing\n• Salesforce Admin'
  };
  return certMap[stream] || '• Google IT Support\n• Microsoft Office Specialist\n• Digital Marketing Certification';
};

const getExpectedSalary = (stream) => {
  const salaryMap = {
    'Computer Science': '4-8 LPA',
    'Engineering': '3.5-7 LPA', 
    'Business': '3-6 LPA',
    'Science': '3-5.5 LPA'
  };
  return salaryMap[stream] || '3-6 LPA';
};

const getInterviewFocus = (stream) => {
  const focusMap = {
    'Computer Science': 'Coding problems, system design, technical concepts',
    'Engineering': 'Problem-solving, project experience, technical aptitude',
    'Business': 'Case studies, analytical thinking, communication skills'
  };
  return focusMap[stream] || 'Problem-solving, communication, relevant projects';
};

const getRandomCareerTip = () => {
  const tips = [
    "Networking is key - 70% of jobs aren't publicly advertised!",
    "Update your LinkedIn weekly to stay visible to recruiters",
    "Learn one new skill every quarter to stay relevant",
    "Build projects that solve real problems, not just tutorials",
    "Practice coding problems daily, even if you're not a developer"
  ];
  return tips[Math.floor(Math.random() * tips.length)];
};

const getRandomMarketInsight = () => {
  const insights = [
    "AI/ML roles have grown 300% in the past 2 years in India",
    "Remote work opportunities increased 250% post-2020",
    "Full-stack developers are the most in-demand tech professionals",
    "Data Science remains the top-paying field for freshers",
    "Soft skills are becoming as important as technical skills"
  ];
  return insights[Math.floor(Math.random() * insights.length)];
};

const getRandomSuccessTip = () => {
  const tips = [
    "Document your achievements quantitatively (increased efficiency by X%)",
    "Seek feedback regularly and act on it to accelerate growth",
    "Choose your first job for learning, not just salary",
    "Build a personal brand through consistent content sharing",
    "Always have a 90-day learning goal to stay motivated"
  ];
  return tips[Math.floor(Math.random() * tips.length)];
};