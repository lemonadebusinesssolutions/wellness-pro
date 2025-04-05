-- Add new assessment types
INSERT INTO assessments (type, title, description, duration, icon) VALUES
  ('happiness', 'Happiness Assessment', 'Evaluate your current levels of happiness and life satisfaction', '5-10 minutes', 'smile'),
  ('physical_wellbeing', 'Physical Wellbeing Assessment', 'Assess your overall physical health and wellness habits', '5-10 minutes', 'activity'),
  ('emotional_wellbeing', 'Emotional Wellbeing Assessment', 'Evaluate your emotional health and regulation abilities', '5-10 minutes', 'heart'),
  ('social_connection', 'Social Connection Assessment', 'Assess the quality and quantity of your social relationships', '5-10 minutes', 'users'),
  ('sleep_quality', 'Sleep Quality Assessment', 'Evaluate your sleep patterns and quality', '5-10 minutes', 'moon'),
  ('mindfulness', 'Mindfulness Assessment', 'Assess your mindfulness practice and relaxation techniques', '5-10 minutes', 'zap'),
  ('self_compassion', 'Self-Compassion Assessment', 'Evaluate how you treat yourself during difficult times', '5-10 minutes', 'shield'),
  ('financial_wellbeing', 'Financial Wellbeing Assessment', 'Assess your financial health and money management', '5-10 minutes', 'dollar-sign'),
  ('life_purpose', 'Life Purpose Assessment', 'Evaluate your sense of meaning and purpose in life', '5-10 minutes', 'compass'),
  ('resilience', 'Resilience Assessment', 'Assess your ability to bounce back from challenges', '5-10 minutes', 'trending-up'),
  ('nutrition', 'Nutrition Assessment', 'Evaluate your dietary habits and nutrition knowledge', '5-10 minutes', 'apple'),
  ('physical_activity', 'Physical Activity Assessment', 'Assess your exercise habits and physical activity levels', '5-10 minutes', 'dumbbell');

-- Add sample questions for each assessment
-- Happiness Assessment
INSERT INTO questions (assessment_type, text, options, "order", category) VALUES
  ('happiness', 'How satisfied are you with your life as a whole?', '["Very dissatisfied", "Dissatisfied", "Neither satisfied nor dissatisfied", "Satisfied", "Very satisfied"]', 1, 'life_satisfaction'),
  ('happiness', 'How often do you feel joy in your daily life?', '["Never", "Rarely", "Sometimes", "Often", "Very often"]', 2, 'positive_emotions'),
  ('happiness', 'To what extent do you feel your life is meaningful?', '["Not at all", "Slightly", "Moderately", "Very much", "Extremely"]', 3, 'meaning'),
  ('happiness', 'How often do you feel a sense of accomplishment?', '["Never", "Rarely", "Sometimes", "Often", "Very often"]', 4, 'achievement'),
  ('happiness', 'How frequently do you engage in activities purely because they make you happy?', '["Never", "Rarely", "Sometimes", "Often", "Very often"]', 5, 'engagement');

-- Physical Wellbeing Assessment
INSERT INTO questions (assessment_type, text, options, "order", category) VALUES
  ('physical_wellbeing', 'How would you rate your overall physical health?', '["Poor", "Fair", "Good", "Very good", "Excellent"]', 1, 'general_health'),
  ('physical_wellbeing', 'How often do you experience physical pain that interferes with your daily activities?', '["Daily", "Several times a week", "About once a week", "A few times a month", "Rarely or never"]', 2, 'pain'),
  ('physical_wellbeing', 'How frequently do you engage in physical activity that makes you sweat or breathe harder?', '["Never", "1-2 times per month", "1-2 times per week", "3-4 times per week", "5+ times per week"]', 3, 'exercise'),
  ('physical_wellbeing', 'How would you describe your overall energy levels?', '["Very low", "Low", "Moderate", "High", "Very high"]', 4, 'energy'),
  ('physical_wellbeing', 'How satisfied are you with your body and physical appearance?', '["Very dissatisfied", "Somewhat dissatisfied", "Neither satisfied nor dissatisfied", "Somewhat satisfied", "Very satisfied"]', 5, 'body_image');

-- Emotional Wellbeing Assessment
INSERT INTO questions (assessment_type, text, options, "order", category) VALUES
  ('emotional_wellbeing', 'How well do you understand your emotions?', '["Not at all", "Slightly", "Moderately", "Very well", "Extremely well"]', 1, 'emotional_awareness'),
  ('emotional_wellbeing', 'How effectively can you manage negative emotions?', '["Not at all", "Slightly", "Moderately", "Very", "Extremely"]', 2, 'emotion_regulation'),
  ('emotional_wellbeing', 'How often do you feel overwhelmed by your emotions?', '["Very often", "Often", "Sometimes", "Rarely", "Never"]', 3, 'emotional_stability'),
  ('emotional_wellbeing', 'How comfortable are you expressing your emotions to others?', '["Very uncomfortable", "Uncomfortable", "Neutral", "Comfortable", "Very comfortable"]', 4, 'emotional_expression'),
  ('emotional_wellbeing', 'How frequently do you experience positive emotions?', '["Rarely", "Occasionally", "Sometimes", "Often", "Very often"]', 5, 'positive_emotions');

-- Social Connection Assessment
INSERT INTO questions (assessment_type, text, options, "order", category) VALUES
  ('social_connection', 'How satisfied are you with your social relationships?', '["Very dissatisfied", "Dissatisfied", "Neither satisfied nor dissatisfied", "Satisfied", "Very satisfied"]', 1, 'relationship_satisfaction'),
  ('social_connection', 'How often do you feel lonely?', '["Almost always", "Often", "Sometimes", "Rarely", "Never"]', 2, 'loneliness'),
  ('social_connection', 'How many people do you feel you can confide in?', '["None", "1 person", "2-3 people", "4-5 people", "More than 5 people"]', 3, 'social_support'),
  ('social_connection', 'How often do you connect meaningfully with others?', '["Rarely or never", "Once or twice a month", "Once a week", "Several times a week", "Daily"]', 4, 'connection'),
  ('social_connection', 'How comfortable are you in social situations?', '["Very uncomfortable", "Uncomfortable", "Neutral", "Comfortable", "Very comfortable"]', 5, 'social_ease');

-- Sleep Quality Assessment
INSERT INTO questions (assessment_type, text, options, "order", category) VALUES
  ('sleep_quality', 'How would you rate your sleep quality overall?', '["Very poor", "Poor", "Fair", "Good", "Very good"]', 1, 'sleep_quality'),
  ('sleep_quality', 'How long does it typically take you to fall asleep?', '["More than 60 minutes", "31-60 minutes", "16-30 minutes", "5-15 minutes", "Less than 5 minutes"]', 2, 'sleep_latency'),
  ('sleep_quality', 'How often do you wake up during the night?', '["Multiple times every night", "Once every night", "Several times a week", "Occasionally", "Rarely or never"]', 3, 'sleep_continuity'),
  ('sleep_quality', 'How refreshed do you feel when you wake up?', '["Not at all refreshed", "Slightly refreshed", "Moderately refreshed", "Very refreshed", "Completely refreshed"]', 4, 'sleep_refreshment'),
  ('sleep_quality', 'How consistent is your sleep schedule?', '["Very inconsistent", "Somewhat inconsistent", "Moderately consistent", "Consistent", "Very consistent"]', 5, 'sleep_consistency');

-- Mindfulness Assessment
INSERT INTO questions (assessment_type, text, options, "order", category) VALUES
  ('mindfulness', 'How often do you find yourself doing things without paying attention?', '["Almost always", "Very frequently", "Sometimes", "Rarely", "Almost never"]', 1, 'present_moment'),
  ('mindfulness', 'How often do you take time to notice your thoughts without judgment?', '["Never", "Rarely", "Sometimes", "Often", "Very often"]', 2, 'awareness'),
  ('mindfulness', 'How often do you practice formal mindfulness techniques?', '["Never", "Rarely", "Occasionally", "Regularly", "Daily"]', 3, 'practice'),
  ('mindfulness', 'How well can you focus on one task without being distracted?', '["Very poorly", "Poorly", "Moderately well", "Well", "Very well"]', 4, 'attention'),
  ('mindfulness', 'How often do you notice bodily sensations like tension or relaxation?', '["Never", "Rarely", "Sometimes", "Often", "Very often"]', 5, 'body_awareness');

-- Self-Compassion Assessment
INSERT INTO questions (assessment_type, text, options, "order", category) VALUES
  ('self_compassion', 'How kind are you to yourself when you make mistakes?', '["Very unkind", "Somewhat unkind", "Neutral", "Somewhat kind", "Very kind"]', 1, 'self_kindness'),
  ('self_compassion', 'How often do you criticize yourself harshly?', '["Very often", "Often", "Sometimes", "Rarely", "Never"]', 2, 'self_judgment'),
  ('self_compassion', 'How well do you recognize that difficulties are part of everyone''s experience?', '["Not at all", "Slightly", "Moderately", "Very well", "Extremely well"]', 3, 'common_humanity'),
  ('self_compassion', 'How often do you get carried away with negative thoughts about yourself?', '["Very often", "Often", "Sometimes", "Rarely", "Never"]', 4, 'over_identification'),
  ('self_compassion', 'How often do you make time for self-care activities?', '["Never", "Rarely", "Sometimes", "Often", "Very often"]', 5, 'self_care');

-- Financial Wellbeing Assessment
INSERT INTO questions (assessment_type, text, options, "order", category) VALUES
  ('financial_wellbeing', 'How confident are you about your long-term financial future?', '["Not at all confident", "Slightly confident", "Moderately confident", "Very confident", "Extremely confident"]', 1, 'financial_security'),
  ('financial_wellbeing', 'How often do you worry about money?', '["Daily", "Several times a week", "Once a week", "Occasionally", "Rarely or never"]', 2, 'financial_stress'),
  ('financial_wellbeing', 'How satisfied are you with your current financial situation?', '["Very dissatisfied", "Dissatisfied", "Neutral", "Satisfied", "Very satisfied"]', 3, 'financial_satisfaction'),
  ('financial_wellbeing', 'How prepared are you for unexpected financial emergencies?', '["Not at all prepared", "Slightly prepared", "Moderately prepared", "Well prepared", "Very well prepared"]', 4, 'financial_resilience'),
  ('financial_wellbeing', 'How well do you manage your day-to-day finances?', '["Very poorly", "Poorly", "Adequately", "Well", "Very well"]', 5, 'financial_management');

-- Life Purpose Assessment
INSERT INTO questions (assessment_type, text, options, "order", category) VALUES
  ('life_purpose', 'How clear is your sense of purpose in life?', '["Not at all clear", "Slightly clear", "Moderately clear", "Very clear", "Extremely clear"]', 1, 'purpose_clarity'),
  ('life_purpose', 'How often do you engage in activities that feel meaningful to you?', '["Rarely or never", "Occasionally", "Sometimes", "Often", "Very often"]', 2, 'engagement'),
  ('life_purpose', 'How well do your daily activities align with your values?', '["Not at all", "Slightly", "Moderately", "Very well", "Extremely well"]', 3, 'values_alignment'),
  ('life_purpose', 'How often do you feel your life makes a positive difference?', '["Rarely or never", "Occasionally", "Sometimes", "Often", "Very often"]', 4, 'contribution'),
  ('life_purpose', 'How satisfied are you with the direction your life is heading?', '["Very dissatisfied", "Dissatisfied", "Neutral", "Satisfied", "Very satisfied"]', 5, 'life_direction');

-- Resilience Assessment
INSERT INTO questions (assessment_type, text, options, "order", category) VALUES
  ('resilience', 'How quickly do you recover from setbacks?', '["Very slowly", "Slowly", "Moderately quickly", "Quickly", "Very quickly"]', 1, 'recovery'),
  ('resilience', 'How well do you adapt to change?', '["Very poorly", "Poorly", "Moderately well", "Well", "Very well"]', 2, 'adaptability'),
  ('resilience', 'How confident are you in your ability to handle difficult situations?', '["Not at all confident", "Slightly confident", "Moderately confident", "Very confident", "Extremely confident"]', 3, 'self_efficacy'),
  ('resilience', 'How effectively do you learn from challenges?', '["Not at all effectively", "Slightly effectively", "Moderately effectively", "Very effectively", "Extremely effectively"]', 4, 'growth'),
  ('resilience', 'How well do you maintain perspective during difficult times?', '["Very poorly", "Poorly", "Moderately well", "Well", "Very well"]', 5, 'perspective');

-- Nutrition Assessment
INSERT INTO questions (assessment_type, text, options, "order", category) VALUES
  ('nutrition', 'How many servings of fruits and vegetables do you typically eat daily?', '["0", "1-2", "3-4", "5-6", "7 or more"]', 1, 'produce_intake'),
  ('nutrition', 'How often do you eat highly processed foods?', '["Multiple times daily", "Once daily", "Several times a week", "Occasionally", "Rarely or never"]', 2, 'processed_foods'),
  ('nutrition', 'How regular are your eating patterns?', '["Very irregular", "Somewhat irregular", "Moderately regular", "Regular", "Very regular"]', 3, 'eating_patterns'),
  ('nutrition', 'How mindful are you while eating?', '["Not at all mindful", "Slightly mindful", "Moderately mindful", "Very mindful", "Extremely mindful"]', 4, 'mindful_eating'),
  ('nutrition', 'How satisfied are you with your overall diet?', '["Very dissatisfied", "Dissatisfied", "Neutral", "Satisfied", "Very satisfied"]', 5, 'diet_satisfaction');

-- Physical Activity Assessment
INSERT INTO questions (assessment_type, text, options, "order", category) VALUES
  ('physical_activity', 'How many days per week do you engage in moderate to vigorous physical activity?', '["0 days", "1-2 days", "3-4 days", "5-6 days", "7 days"]', 1, 'frequency'),
  ('physical_activity', 'How long are your typical exercise sessions?', '["I don''t exercise", "Less than 15 minutes", "15-30 minutes", "30-60 minutes", "More than 60 minutes"]', 2, 'duration'),
  ('physical_activity', 'How would you rate the variety in your physical activities?', '["Very limited", "Somewhat limited", "Moderate variety", "Good variety", "Excellent variety"]', 3, 'variety'),
  ('physical_activity', 'How much do you enjoy physical activity?', '["Not at all", "Slightly", "Moderately", "Very much", "Extremely"]', 4, 'enjoyment'),
  ('physical_activity', 'How often do you incorporate strength training into your routine?', '["Never", "Rarely", "Sometimes", "Often", "Very often"]', 5, 'strength_training');

-- Add basic recommendations for each assessment
-- Happiness Assessment Recommendations
INSERT INTO recommendations (assessment_type, category, min_score, max_score, title, description, priority, tips) VALUES
  ('happiness', 'life_satisfaction', 0, 30, 'Life Satisfaction Reflection', 'Consider journaling about aspects of your life that feel unfulfilling and identifying one small change you could make this week.', 'High', '[]'),
  ('happiness', 'positive_emotions', 0, 30, 'Positive Emotion Practice', 'Try incorporating a daily gratitude practice by noting three good things that happen each day.', 'High', '[]'),
  ('happiness', 'meaning', 0, 30, 'Meaning and Purpose Exploration', 'Consider volunteering for a cause you care about to increase your sense of meaning and connection.', 'High', '[]'),
  ('happiness', 'life_satisfaction', 31, 70, 'Values Clarification', 'Take time to identify your core values and assess how your daily life aligns with them.', 'Medium', '[]'),
  ('happiness', 'positive_emotions', 31, 70, 'Savoring Practice', 'Enhance positive experiences by practicing savoring - fully attending to and appreciating pleasant moments.', 'Medium', '[]'),
  ('happiness', 'life_satisfaction', 71, 100, 'Share Your Wellbeing', 'Consider mentoring others in finding greater life satisfaction using strategies that have worked for you.', 'Low', '[]');

-- Physical Wellbeing Assessment Recommendations
INSERT INTO recommendations (assessment_type, category, min_score, max_score, title, description, priority, tips) VALUES
  ('physical_wellbeing', 'general_health', 0, 30, 'Health Assessment', 'Schedule a comprehensive check-up with your healthcare provider to establish baseline health metrics.', 'High', '[]'),
  ('physical_wellbeing', 'pain', 0, 30, 'Pain Management Strategies', 'Consider consulting with a physical therapist about pain management techniques specific to your needs.', 'High', '[]'),
  ('physical_wellbeing', 'exercise', 0, 30, 'Gentle Movement Introduction', 'Begin with 5-10 minutes of gentle movement daily, such as walking or stretching.', 'High', '[]'),
  ('physical_wellbeing', 'energy', 31, 70, 'Energy Audit', 'Track your energy levels throughout the day to identify patterns and make adjustments to your schedule accordingly.', 'Medium', '[]'),
  ('physical_wellbeing', 'body_image', 31, 70, 'Body Appreciation Practice', 'Practice focusing on what your body can do rather than how it looks.', 'Medium', '[]'),
  ('physical_wellbeing', 'general_health', 71, 100, 'Preventive Health Focus', 'Maintain your excellent health practices and consider adding preventive health measures like regular screenings.', 'Low', '[]');

-- Add representative recommendations for remaining assessments
INSERT INTO recommendations (assessment_type, category, min_score, max_score, title, description, priority, tips) VALUES
  -- Emotional Wellbeing
  ('emotional_wellbeing', 'emotional_awareness', 0, 30, 'Emotion Journaling', 'Start a daily emotion journal to identify and name your feelings throughout the day.', 'High', '[]'),
  ('emotional_wellbeing', 'emotion_regulation', 31, 70, 'Emotional Regulation Techniques', 'Practice deep breathing or progressive muscle relaxation when feeling emotionally overwhelmed.', 'Medium', '[]'),
  ('emotional_wellbeing', 'positive_emotions', 71, 100, 'Emotional Intelligence Sharing', 'Consider mentoring others in emotional awareness techniques that have worked well for you.', 'Low', '[]'),
  -- Social Connection
  ('social_connection', 'loneliness', 0, 30, 'Connection Building Plan', 'Identify one social connection to strengthen this week through a phone call, message, or meeting.', 'High', '[]'),
  ('social_connection', 'social_support', 31, 70, 'Social Circle Expansion', 'Consider joining a group or class aligned with your interests to meet new people with shared passions.', 'Medium', '[]'),
  ('social_connection', 'relationship_satisfaction', 71, 100, 'Relationship Nurturing', 'Continue investing in your strong relationships and consider how you can support others seeking connection.', 'Low', '[]'),
  -- Sleep Quality
  ('sleep_quality', 'sleep_quality', 0, 30, 'Sleep Environment Optimization', 'Evaluate your bedroom for light, noise, and temperature issues that might be disrupting your sleep.', 'High', '[]'),
  ('sleep_quality', 'sleep_consistency', 31, 70, 'Sleep Schedule Regularity', 'Try to maintain a consistent sleep and wake time, even on weekends.', 'Medium', '[]'),
  ('sleep_quality', 'sleep_quality', 71, 100, 'Sleep Quality Maintenance', 'Continue your excellent sleep habits and consider sharing your effective strategies with others.', 'Low', '[]'),
  -- Other assessments
  ('mindfulness', 'present_moment', 0, 30, 'Present Moment Anchoring', 'Practice bringing your attention to your breath for 1-2 minutes several times throughout the day.', 'High', '[]'),
  ('self_compassion', 'self_judgment', 0, 30, 'Self-Talk Awareness', 'Notice your inner critic and practice responding as you would to a good friend instead.', 'High', '[]'),
  ('financial_wellbeing', 'financial_stress', 0, 30, 'Financial Clarity Plan', 'Create a simple budget to track your income and expenses for greater financial awareness.', 'High', '[]'),
  ('life_purpose', 'purpose_clarity', 0, 30, 'Values Identification', 'Make a list of your core values and consider how they might translate into meaningful action.', 'High', '[]'),
  ('resilience', 'recovery', 0, 30, 'Resilience Journal', 'Start a journal documenting challenges you face and the strategies that help you move forward.', 'High', '[]'),
  ('nutrition', 'produce_intake', 0, 30, 'Produce Introduction', 'Try adding one additional serving of fruits or vegetables to your daily meals.', 'High', '[]'),
  ('physical_activity', 'frequency', 0, 30, 'Movement Introduction', 'Begin with just 5-10 minutes of enjoyable movement daily to build a sustainable habit.', 'High', '[]');