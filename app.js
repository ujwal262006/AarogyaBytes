// AarogyaBytes AI - Comprehensive Health Chatbot Platform
class AarogaByteAI {
    constructor() {
        this.currentLanguage = 'EN';
        this.currentInterface = 'web';
        this.sessionData = {
            messages: [],
            symptoms: [],
            patientInfo: {},
            assessmentResult: null,
            startTime: new Date(),
            sessionId: this.generateSessionId()
        };
        this.analyticsData = this.loadAnalytics();
        this.medicalData = this.initializeMedicalData();
        this.conversationState = {
            stage: 'greeting',
            awaitingFollowup: false,
            currentCondition: null,
            severityScore: 0,
            urgencyLevel: 'low'
        };
        
        this.init();
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    initializeMedicalData() {
        return {
            conditions: [
                {
                    id: "viral_fever",
                    nameEN: "Viral Fever",
                    nameHI: "वायरल बुखार",
                    category: "infectious",
                    symptoms: {
                        primary: ["fever", "temperature", "chills", "बुखार", "ठंड", "तापमान"],
                        secondary: ["headache", "body ache", "fatigue", "weakness", "सिर दर्द", "बदन दर्द", "कमजोरी"],
                        duration: ["1-5 days", "1-5 दिन"]
                    },
                    urgency: "moderate",
                    confidence_threshold: 0.7,
                    followup_questions: [
                        { EN: "How many days have you had fever?", HI: "कितने दिन से बुखार है?" },
                        { EN: "What is your temperature reading?", HI: "तापमान कितना है?" },
                        { EN: "Do you have body aches?", HI: "क्या बदन दर्द है?" }
                    ]
                },
                {
                    id: "common_cold",
                    nameEN: "Common Cold",
                    nameHI: "जुकाम",
                    category: "respiratory",
                    symptoms: {
                        primary: ["runny nose", "sneezing", "cough", "नाक बहना", "छींक", "खांसी"],
                        secondary: ["sore throat", "congestion", "mild fever", "गले में खराश", "नाक बंद", "हल्का बुखार"],
                        duration: ["3-7 days", "3-7 दिन"]
                    },
                    urgency: "low",
                    confidence_threshold: 0.8,
                    followup_questions: [
                        { EN: "Is your nose runny or blocked?", HI: "नाक बह रही है या बंद है?" },
                        { EN: "Do you have a sore throat?", HI: "क्या गले में खराश है?" }
                    ]
                },
                {
                    id: "gastroenteritis",
                    nameEN: "Gastroenteritis",
                    nameHI: "पेट में संक्रमण",
                    category: "gastrointestinal",
                    symptoms: {
                        primary: ["vomiting", "diarrhea", "nausea", "उल्टी", "दस्त", "जी मिचलाना"],
                        secondary: ["stomach pain", "cramps", "dehydration", "पेट दर्द", "मरोड़", "पानी की कमी"],
                        duration: ["2-5 days", "2-5 दिन"]
                    },
                    urgency: "moderate",
                    confidence_threshold: 0.75,
                    followup_questions: [
                        { EN: "How many times have you vomited today?", HI: "आज कितनी बार उल्टी हुई है?" },
                        { EN: "Are you able to keep fluids down?", HI: "क्या पानी पी सकते हैं?" }
                    ]
                },
                {
                    id: "chest_pain",
                    nameEN: "Chest Pain",
                    nameHI: "छाती में दर्द",
                    category: "cardiovascular",
                    symptoms: {
                        primary: ["chest pain", "chest pressure", "chest tightness", "छाती में दर्द", "सीने में दबाव", "सीने में जकड़न"],
                        secondary: ["shortness of breath", "sweating", "nausea", "सांस फूलना", "पसीना", "जी मिचलाना"],
                        duration: ["immediate", "तुरंत"]
                    },
                    urgency: "emergency",
                    confidence_threshold: 0.6,
                    followup_questions: [
                        { EN: "Is the pain severe (8-10/10)?", HI: "क्या दर्द बहुत तेज है (8-10/10)?" },
                        { EN: "Are you having trouble breathing?", HI: "क्या सांस लेने में तकलीफ है?" }
                    ]
                },
                {
                    id: "migraine",
                    nameEN: "Migraine Headache",
                    nameHI: "माइग्रेन सिर दर्द",
                    category: "neurological",
                    symptoms: {
                        primary: ["severe headache", "throbbing pain", "pulsating pain", "तेज सिर दर्द", "धड़कने वाला दर्द"],
                        secondary: ["nausea", "light sensitivity", "sound sensitivity", "जी मिचलाना", "रोशनी से परेशानी", "आवाज से परेशानी"],
                        duration: ["4-72 hours", "4-72 घंटे"]
                    },
                    urgency: "moderate",
                    confidence_threshold: 0.7,
                    followup_questions: [
                        { EN: "Is the headache on one side?", HI: "क्या सिर दर्द एक तरफ है?" },
                        { EN: "Does light make it worse?", HI: "क्या रोशनी से दर्द बढ़ता है?" }
                    ]
                },
                {
                    id: "anxiety",
                    nameEN: "Anxiety",
                    nameHI: "चिंता",
                    category: "mental_health",
                    symptoms: {
                        primary: ["worry", "nervousness", "restlessness", "चिंता", "घबराहट", "बेचैनी"],
                        secondary: ["rapid heartbeat", "sweating", "difficulty concentrating", "तेज दिल की धड़कन", "पसीना", "ध्यान न लगना"],
                        duration: ["ongoing", "निरंतर"]
                    },
                    urgency: "moderate",
                    confidence_threshold: 0.65
                }
            ],
            urgencyLevels: {
                emergency: {
                    color: "#dc3545",
                    icon: "🚨",
                    labelEN: "EMERGENCY",
                    labelHI: "आपातकाल",
                    action: "Seek immediate medical attention",
                    actionHI: "तुरंत चिकित्सा सहायता लें"
                },
                high: {
                    color: "#fd7e14",
                    icon: "🔴",
                    labelEN: "URGENT",
                    labelHI: "तत्काल",
                    action: "See doctor within 24 hours",
                    actionHI: "24 घंटे में डॉक्टर से मिलें"
                },
                moderate: {
                    color: "#ffc107",
                    icon: "🟡",
                    labelEN: "MODERATE",
                    labelHI: "मध्यम",
                    action: "Schedule appointment within 3-7 days",
                    actionHI: "3-7 दिन में अपॉइंटमेंट लें"
                },
                low: {
                    color: "#28a745",
                    icon: "🟢",
                    labelEN: "LOW",
                    labelHI: "कम",
                    action: "Monitor symptoms and rest",
                    actionHI: "लक्षणों पर नजर रखें और आराम करें"
                }
            }
        };
    }

    init() {
        this.setupEventListeners();
        this.updateUI();
        this.loadTranslations();
        this.showWelcomeScreen();
    }

    setupEventListeners() {
        // Language toggle
        document.getElementById('languageToggle').addEventListener('click', () => {
            this.toggleLanguage();
        });

        // Interface selection
        document.getElementById('webChatBtn').addEventListener('click', () => {
            this.startInterface('web');
        });
        
        document.getElementById('whatsappBtn').addEventListener('click', () => {
            this.startInterface('whatsapp');
        });

        // Chat controls
        document.getElementById('backBtn').addEventListener('click', () => {
            this.showWelcomeScreen();
        });
        
        document.getElementById('whatsappBackBtn').addEventListener('click', () => {
            this.showWelcomeScreen();
        });

        document.getElementById('newChatBtn').addEventListener('click', () => {
            this.startNewChat();
        });

        // Message sending
        document.getElementById('sendBtn').addEventListener('click', () => {
            this.sendMessage();
        });
        
        document.getElementById('messageInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        document.getElementById('whatsappSendBtn').addEventListener('click', () => {
            this.sendWhatsAppMessage();
        });
        
        document.getElementById('whatsappMessageInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendWhatsAppMessage();
            }
        });

        // Report generation
        document.getElementById('generateReportBtn').addEventListener('click', () => {
            this.showReportModal();
        });
        
        document.getElementById('whatsappReportBtn').addEventListener('click', () => {
            this.showReportModal();
        });

        document.getElementById('downloadReportBtn').addEventListener('click', () => {
            this.generatePDFReport();
        });

        // Analytics
        document.getElementById('analyticsBtn').addEventListener('click', () => {
            this.showAnalytics();
        });
        
        document.getElementById('closeAnalyticsBtn').addEventListener('click', () => {
            this.hideAnalytics();
        });

        // Modal controls
        document.getElementById('closeReportModal').addEventListener('click', () => {
            this.hideModal('reportModal');
        });
        
        document.getElementById('cancelReportBtn').addEventListener('click', () => {
            this.hideModal('reportModal');
        });

        document.getElementById('continueConsultationBtn').addEventListener('click', () => {
            this.hideModal('emergencyModal');
        });

        document.getElementById('callAmbulanceBtn').addEventListener('click', () => {
            this.callEmergencyServices();
        });
    }

    loadTranslations() {
        this.translations = {
            EN: {
                welcomeTitle: "Welcome to AarogyaBytes AI",
                welcomeSubtitle: "Get instant medical guidance with our AI-powered health assistant. Available in English and Hindi.",
                selectInterface: "Choose Your Preferred Interface",
                webChatTitle: "Web Chat",
                webChatDesc: "Modern chat interface with rich features",
                whatsappTitle: "WhatsApp Style",
                whatsappDesc: "Familiar WhatsApp-like experience",
                feature1: "AI-Powered Diagnosis",
                feature2: "Detailed Health Reports",
                feature3: "Emergency Detection",
                feature4: "Bilingual Support",
                chatAssistant: "Health Assistant",
                onlineStatus: "Online",
                typingText: "AI is typing...",
                greeting: "Hello! I'm your AI health assistant. How can I help you today?",
                symptomRequest: "Please describe your symptoms in detail.",
                followupDuration: "How long have you been experiencing these symptoms?",
                followupSeverity: "On a scale of 1-10, how severe is your discomfort?",
                emergencyTitle: "🚨 EMERGENCY DETECTED",
                emergencyMessage: "Based on your symptoms, you may need immediate medical attention.",
                emergencyContactsTitle: "Emergency Contacts:",
                reportTitle: "Generate Health Report",
                patientNameLabel: "Patient Name:",
                reportLanguageLabel: "Report Language:",
                disclaimerText: "Medical Disclaimer: This AI assistant provides general health information only and is not a substitute for professional medical advice. Always consult with qualified healthcare providers for medical concerns.",
                poweredBy: "Powered by AarogyaBytes AI Technology"
            },
            HI: {
                welcomeTitle: "AarogyaBytes AI में आपका स्वागत है",
                welcomeSubtitle: "हमारे AI-संचालित स्वास्थ्य सहायक के साथ तत्काल चिकित्सा मार्गदर्शन प्राप्त करें। हिंदी और अंग्रेजी में उपलब्ध।",
                selectInterface: "अपना पसंदीदा इंटरफ़ेस चुनें",
                webChatTitle: "वेब चैट",
                webChatDesc: "समृद्ध सुविधाओं के साथ आधुनिक चैट इंटरफ़ेस",
                whatsappTitle: "WhatsApp स्टाइल",
                whatsappDesc: "परिचित WhatsApp जैसा अनुभव",
                feature1: "AI-संचालित निदान",
                feature2: "विस्तृत स्वास्थ्य रिपोर्ट",
                feature3: "आपातकालीन पहचान",
                feature4: "द्विभाषी समर्थन",
                chatAssistant: "स्वास्थ्य सहायक",
                onlineStatus: "ऑनलाइन",
                typingText: "AI टाइप कर रहा है...",
                greeting: "नमस्ते! मैं आपका AI स्वास्थ्य सहायक हूं। आज मैं आपकी कैसे मदद कर सकता हूं?",
                symptomRequest: "कृपया अपने लक्षणों का विस्तार से वर्णन करें।",
                followupDuration: "आपको ये लक्षण कितने समय से हैं?",
                followupSeverity: "1-10 के पैमाने पर, आपकी परेशानी कितनी गंभीर है?",
                emergencyTitle: "🚨 आपातकाल का पता चला",
                emergencyMessage: "आपके लक्षणों के आधार पर, आपको तत्काल चिकित्सा सहायता की आवश्यकता हो सकती है।",
                emergencyContactsTitle: "आपातकालीन संपर्क:",
                reportTitle: "स्वास्थ्य रिपोर्ट तैयार करें",
                patientNameLabel: "मरीज़ का नाम:",
                reportLanguageLabel: "रिपोर्ट की भाषा:",
                disclaimerText: "चिकित्सा अस्वीकरण: यह AI सहायक केवल सामान्य स्वास्थ्य जानकारी प्रदान करता है और पेशेवर चिकित्सा सलाह का विकल्प नहीं है। चिकित्सा संबंधी चिंताओं के लिए हमेशा योग्य स्वास्थ्य सेवा प्रदाताओं से सलाह लें।",
                poweredBy: "AarogyaBytes AI तकनीक द्वारा संचालित"
            }
        };
    }

    toggleLanguage() {
        this.currentLanguage = this.currentLanguage === 'EN' ? 'HI' : 'EN';
        document.getElementById('languageToggle').textContent = this.currentLanguage === 'EN' ? 'हिन्दी' : 'English';
        this.updateUI();
    }

    updateUI() {
        const t = this.translations[this.currentLanguage];
        if (!t) return;

        // Update all text elements
        Object.keys(t).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                element.textContent = t[key];
            }
        });
    }

    showWelcomeScreen() {
        document.getElementById('welcomeScreen').classList.remove('hidden');
        document.getElementById('chatInterface').classList.add('hidden');
        document.getElementById('whatsappInterface').classList.add('hidden');
        this.currentInterface = null;
    }

    startInterface(type) {
        this.currentInterface = type;
        document.getElementById('welcomeScreen').classList.add('hidden');
        
        if (type === 'web') {
            document.getElementById('chatInterface').classList.remove('hidden');
            document.getElementById('whatsappInterface').classList.add('hidden');
            this.initializeWebChat();
        } else if (type === 'whatsapp') {
            document.getElementById('whatsappInterface').classList.remove('hidden');
            document.getElementById('chatInterface').classList.add('hidden');
            this.initializeWhatsAppChat();
        }
        
        this.startNewChat();
        this.updateAnalytics('session_started');
    }

    startNewChat() {
        this.sessionData = {
            messages: [],
            symptoms: [],
            patientInfo: {},
            assessmentResult: null,
            startTime: new Date(),
            sessionId: this.generateSessionId()
        };
        
        this.conversationState = {
            stage: 'greeting',
            awaitingFollowup: false,
            currentCondition: null,
            severityScore: 0,
            urgencyLevel: 'low'
        };

        this.clearMessages();
        this.sendBotMessage(this.translations[this.currentLanguage].greeting);
    }

    clearMessages() {
        if (this.currentInterface === 'web') {
            document.getElementById('chatMessages').innerHTML = '';
        } else if (this.currentInterface === 'whatsapp') {
            document.getElementById('whatsappMessages').innerHTML = '';
        }
    }

    initializeWebChat() {
        // Set up web chat specific features
        this.updateMessagePlaceholder();
    }

    initializeWhatsAppChat() {
        // Set up WhatsApp specific features
        document.getElementById('whatsappMessageInput').placeholder = 
            this.currentLanguage === 'EN' ? 'Type a message...' : 'संदेश लिखें...';
    }

    updateMessagePlaceholder() {
        const placeholder = this.currentLanguage === 'EN' ? 
            'Type your symptoms or message...' : 
            'अपने लक्षण या संदेश लिखें...';
        document.getElementById('messageInput').placeholder = placeholder;
    }

    sendMessage() {
        const input = document.getElementById('messageInput');
        const message = input.value.trim();
        if (!message) return;

        this.addMessage(message, 'user');
        input.value = '';
        
        this.processUserMessage(message);
    }

    sendWhatsAppMessage() {
        const input = document.getElementById('whatsappMessageInput');
        const message = input.value.trim();
        if (!message) return;

        this.addWhatsAppMessage(message, 'user');
        input.value = '';
        
        this.processUserMessage(message);
    }

    addMessage(content, sender, urgency = null) {
        if (this.currentInterface === 'web') {
            this.addWebMessage(content, sender, urgency);
        } else if (this.currentInterface === 'whatsapp') {
            this.addWhatsAppMessage(content, sender, urgency);
        }
    }

    addWebMessage(content, sender, urgency = null) {
        const messagesContainer = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message--${sender}`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = content;
        
        if (urgency && sender === 'bot') {
            const urgencyIndicator = document.createElement('div');
            urgencyIndicator.className = `urgency-indicator ${urgency}`;
            urgencyIndicator.innerHTML = `${this.medicalData.urgencyLevels[urgency].icon} ${this.medicalData.urgencyLevels[urgency][`label${this.currentLanguage}`]}`;
            contentDiv.appendChild(urgencyIndicator);
        }
        
        const timeDiv = document.createElement('div');
        timeDiv.className = 'message-time';
        timeDiv.textContent = new Date().toLocaleTimeString();
        
        messageDiv.appendChild(contentDiv);
        contentDiv.appendChild(timeDiv);
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    addWhatsAppMessage(content, sender, urgency = null) {
        const messagesContainer = document.getElementById('whatsappMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `whatsapp-message whatsapp-message--${sender}`;
        messageDiv.textContent = content;
        
        if (urgency && sender === 'bot') {
            const urgencyIndicator = document.createElement('div');
            urgencyIndicator.style.marginTop = '8px';
            urgencyIndicator.style.fontSize = '12px';
            urgencyIndicator.style.color = this.medicalData.urgencyLevels[urgency].color;
            urgencyIndicator.textContent = `${this.medicalData.urgencyLevels[urgency].icon} ${this.medicalData.urgencyLevels[urgency][`label${this.currentLanguage}`]}`;
            messageDiv.appendChild(urgencyIndicator);
        }
        
        const timeDiv = document.createElement('div');
        timeDiv.className = 'whatsapp-message-time';
        timeDiv.textContent = new Date().toLocaleTimeString();
        messageDiv.appendChild(timeDiv);
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    showTypingIndicator() {
        if (this.currentInterface === 'web') {
            document.getElementById('typingIndicator').classList.remove('hidden');
        }
    }

    hideTypingIndicator() {
        if (this.currentInterface === 'web') {
            document.getElementById('typingIndicator').classList.add('hidden');
        }
    }

    sendBotMessage(message, urgency = null, delay = 1500) {
        this.showTypingIndicator();
        
        setTimeout(() => {
            this.hideTypingIndicator();
            this.addMessage(message, 'bot', urgency);
            this.sessionData.messages.push({
                content: message,
                sender: 'bot',
                timestamp: new Date(),
                urgency
            });
        }, delay);
    }

    processUserMessage(message) {
        this.sessionData.messages.push({
            content: message,
            sender: 'user',
            timestamp: new Date()
        });

        // Analyze message and determine response
        const analysis = this.analyzeSymptoms(message);
        this.handleConversationFlow(message, analysis);
        
        this.updateAnalytics('message_sent');
    }

    analyzeSymptoms(message) {
        const lowerMessage = message.toLowerCase();
        const matchedConditions = [];
        
        this.medicalData.conditions.forEach(condition => {
            let score = 0;
            let matchedSymptoms = [];
            
            // Check primary symptoms
            condition.symptoms.primary.forEach(symptom => {
                if (lowerMessage.includes(symptom.toLowerCase())) {
                    score += 3;
                    matchedSymptoms.push(symptom);
                }
            });
            
            // Check secondary symptoms
            condition.symptoms.secondary.forEach(symptom => {
                if (lowerMessage.includes(symptom.toLowerCase())) {
                    score += 1;
                    matchedSymptoms.push(symptom);
                }
            });
            
            if (score > 0) {
                matchedConditions.push({
                    condition,
                    score,
                    matchedSymptoms,
                    confidence: score / (condition.symptoms.primary.length * 3 + condition.symptoms.secondary.length)
                });
            }
        });
        
        // Sort by score
        matchedConditions.sort((a, b) => b.score - a.score);
        
        return {
            matchedConditions,
            hasEmergencySymptoms: this.checkForEmergencySymptoms(message),
            extractedSymptoms: this.extractSymptoms(message)
        };
    }

    checkForEmergencySymptoms(message) {
        const emergencyKeywords = [
            'chest pain', 'difficulty breathing', 'severe pain', 'unconscious',
            'छाती में दर्द', 'सांस लेने में तकलीफ', 'तेज दर्द', 'बेहोशी'
        ];
        
        return emergencyKeywords.some(keyword => 
            message.toLowerCase().includes(keyword.toLowerCase())
        );
    }

    extractSymptoms(message) {
        const symptoms = [];
        // This would be more sophisticated in a real implementation
        // For now, we'll extract based on common patterns
        return symptoms;
    }

    handleConversationFlow(message, analysis) {
        if (analysis.hasEmergencySymptoms) {
            this.handleEmergency(analysis);
            return;
        }

        switch (this.conversationState.stage) {
            case 'greeting':
                this.handleInitialSymptoms(message, analysis);
                break;
            case 'symptom_collection':
                this.handleSymptomFollowup(message, analysis);
                break;
            case 'severity_assessment':
                this.handleSeverityAssessment(message);
                break;
            case 'final_assessment':
                this.provideFinalAssessment();
                break;
        }
    }

    handleInitialSymptoms(message, analysis) {
        if (analysis.matchedConditions.length > 0) {
            const topCondition = analysis.matchedConditions[0];
            this.conversationState.currentCondition = topCondition.condition;
            this.conversationState.stage = 'symptom_collection';
            
            // Ask follow-up questions
            this.askFollowupQuestions(topCondition.condition);
        } else {
            this.sendBotMessage(
                this.currentLanguage === 'EN' ? 
                "I understand you're not feeling well. Could you please describe your specific symptoms? For example, do you have fever, headache, stomach pain, or any other discomfort?" :
                "मैं समझ गया कि आप अस्वस्थ महसूस कर रहे हैं। कृपया अपने विशिष्ट लक्षणों का वर्णन करें? उदाहरण के लिए, क्या आपको बुखार, सिर दर्द, पेट दर्द या कोई अन्य परेशानी है?"
            );
        }
    }

    askFollowupQuestions(condition) {
        if (condition.followup_questions && condition.followup_questions.length > 0) {
            const question = condition.followup_questions[0];
            this.sendBotMessage(question[this.currentLanguage]);
            
            // Set up quick replies
            this.setupQuickReplies(condition);
        } else {
            this.proceedToSeverityAssessment();
        }
    }

    setupQuickReplies(condition) {
        if (this.currentInterface === 'web') {
            const quickRepliesContainer = document.getElementById('quickReplies');
            quickRepliesContainer.innerHTML = '';
            
            // Add contextual quick replies based on condition
            const replies = this.getContextualQuickReplies(condition);
            replies.forEach(reply => {
                const button = document.createElement('button');
                button.className = 'quick-reply';
                button.textContent = reply;
                button.addEventListener('click', () => {
                    document.getElementById('messageInput').value = reply;
                    this.sendMessage();
                });
                quickRepliesContainer.appendChild(button);
            });
        }
    }

    getContextualQuickReplies(condition) {
        const baseReplies = {
            EN: ["Yes", "No", "Not sure", "Severe", "Moderate", "Mild"],
            HI: ["हां", "नहीं", "पक्का नहीं", "गंभीर", "मध्यम", "हल्का"]
        };
        return baseReplies[this.currentLanguage] || baseReplies.EN;
    }

    handleSymptomFollowup(message, analysis) {
        // Process the follow-up response
        this.sessionData.symptoms.push(message);
        
        // Move to severity assessment
        this.conversationState.stage = 'severity_assessment';
        this.proceedToSeverityAssessment();
    }

    proceedToSeverityAssessment() {
        this.sendBotMessage(
            this.currentLanguage === 'EN' ?
            "On a scale of 1-10, how severe is your discomfort? (1 = very mild, 10 = unbearable)" :
            "1-10 के पैमाने पर, आपकी परेशानी कितनी गंभीर है? (1 = बहुत हल्की, 10 = असहनीय)"
        );
    }

    handleSeverityAssessment(message) {
        const severity = this.extractSeverityScore(message);
        this.conversationState.severityScore = severity;
        
        // Final assessment
        this.conversationState.stage = 'final_assessment';
        this.provideFinalAssessment();
    }

    extractSeverityScore(message) {
        const numbers = message.match(/\d+/);
        if (numbers) {
            return parseInt(numbers[0]);
        }
        
        // Handle text-based severity
        const lowerMessage = message.toLowerCase();
        if (lowerMessage.includes('severe') || lowerMessage.includes('गंभीर')) return 8;
        if (lowerMessage.includes('moderate') || lowerMessage.includes('मध्यम')) return 5;
        if (lowerMessage.includes('mild') || lowerMessage.includes('हल्का')) return 3;
        
        return 5; // Default
    }

    provideFinalAssessment() {
        const condition = this.conversationState.currentCondition;
        const severity = this.conversationState.severityScore;
        
        let urgency = condition ? condition.urgency : 'low';
        
        // Adjust urgency based on severity
        if (severity >= 8) urgency = 'high';
        else if (severity >= 6) urgency = 'moderate';
        
        this.conversationState.urgencyLevel = urgency;
        
        const assessment = this.generateAssessment(condition, urgency);
        this.sendBotMessage(assessment, urgency);
        
        // Store assessment result
        this.sessionData.assessmentResult = {
            condition: condition ? condition.nameEN : 'General symptoms',
            urgency,
            severity,
            recommendations: this.getRecommendations(urgency)
        };
        
        this.updateAnalytics('assessment_completed', urgency);
        
        // Offer additional help
        setTimeout(() => {
            this.sendBotMessage(
                this.currentLanguage === 'EN' ?
                "Would you like me to generate a detailed health report for you? You can also ask me about any other health concerns." :
                "क्या आप चाहेंगे कि मैं आपके लिए एक विस्तृत स्वास्थ्य रिपोर्ट तैयार करूं? आप मुझसे अन्य स्वास्थ्य संबंधी चिंताओं के बारे में भी पूछ सकते हैं।"
            );
        }, 2000);
    }

    generateAssessment(condition, urgency) {
        const urgencyInfo = this.medicalData.urgencyLevels[urgency];
        
        let assessment = '';
        
        if (condition) {
            assessment += this.currentLanguage === 'EN' ?
                `Based on your symptoms, you may have: ${condition.nameEN}\n\n` :
                `आपके लक्षणों के आधार पर, आपको हो सकता है: ${condition.nameHI}\n\n`;
        }
        
        assessment += this.currentLanguage === 'EN' ?
            `Urgency Level: ${urgencyInfo.labelEN}\n` :
            `तत्कालता स्तर: ${urgencyInfo.labelHI}\n`;
            
        assessment += this.currentLanguage === 'EN' ?
            `Recommended Action: ${urgencyInfo.action}` :
            `सुझावित कार्रवाई: ${urgencyInfo.actionHI}`;
        
        return assessment;
    }

    getRecommendations(urgency) {
        const recommendations = {
            emergency: {
                EN: [
                    "Call emergency services immediately (108)",
                    "Go to the nearest hospital",
                    "Do not drive yourself",
                    "Have someone stay with you"
                ],
                HI: [
                    "तुरंत आपातकालीन सेवाओं को कॉल करें (108)",
                    "निकटतम अस्पताल जाएं",
                    "खुद गाड़ी न चलाएं",
                    "किसी को अपने साथ रखें"
                ]
            },
            high: {
                EN: [
                    "See a doctor within 24 hours",
                    "Monitor symptoms closely",
                    "Rest and stay hydrated",
                    "Avoid strenuous activities"
                ],
                HI: [
                    "24 घंटे में डॉक्टर से मिलें",
                    "लक्षणों पर बारीकी से नजर रखें",
                    "आराम करें और पानी पिएं",
                    "कठिन गतिविधियों से बचें"
                ]
            },
            moderate: {
                EN: [
                    "Schedule a doctor's appointment",
                    "Monitor symptoms for changes",
                    "Get adequate rest",
                    "Maintain good hygiene"
                ],
                HI: [
                    "डॉक्टर से अपॉइंटमेंट लें",
                    "लक्षणों में बदलाव पर नजर रखें",
                    "पर्याप्त आराम करें",
                    "अच्छी स्वच्छता बनाए रखें"
                ]
            },
            low: {
                EN: [
                    "Monitor symptoms",
                    "Rest and stay hydrated",
                    "Use home remedies if appropriate",
                    "Contact doctor if symptoms worsen"
                ],
                HI: [
                    "लक्षणों पर नजर रखें",
                    "आराम करें और पानी पिएं",
                    "उपयुक्त घरेलू उपचार का उपयोग करें",
                    "लक्षण बिगड़ने पर डॉक्टर से संपर्क करें"
                ]
            }
        };
        
        return recommendations[urgency][this.currentLanguage] || recommendations[urgency].EN;
    }

    handleEmergency(analysis) {
        this.conversationState.urgencyLevel = 'emergency';
        
        this.sendBotMessage(
            this.currentLanguage === 'EN' ?
            "⚠️ EMERGENCY DETECTED: Based on your symptoms, you need immediate medical attention. Please call emergency services or go to the nearest hospital right away." :
            "⚠️ आपातकाल का पता चला: आपके लक्षणों के आधार पर, आपको तत्काल चिकित्सा सहायता की आवश्यकता है। कृपया आपातकालीन सेवाओं को कॉल करें या तुरंत निकटतम अस्पताल जाएं।",
            'emergency'
        );
        
        this.showEmergencyModal();
        this.updateAnalytics('emergency_detected');
    }

    showEmergencyModal() {
        document.getElementById('emergencyModal').classList.remove('hidden');
    }

    hideModal(modalId) {
        document.getElementById(modalId).classList.add('hidden');
    }

    callEmergencyServices() {
        if (window.confirm('This will attempt to call emergency services (108). Proceed?')) {
            window.open('tel:108');
        }
        this.hideModal('emergencyModal');
    }

    showReportModal() {
        document.getElementById('reportModal').classList.remove('hidden');
    }

    generatePDFReport() {
        const patientName = document.getElementById('patientName').value || 'Patient';
        const reportLanguage = document.getElementById('reportLanguage').value;
        
        // Use jsPDF to generate report
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Add content to PDF
        this.createPDFContent(doc, patientName, reportLanguage);
        
        // Download the PDF
        doc.save(`AarogyaBytes_Health_Report_${patientName}_${new Date().toISOString().split('T')[0]}.pdf`);
        
        this.hideModal('reportModal');
        this.updateAnalytics('report_generated');
    }

    createPDFContent(doc, patientName, language) {
        const pageWidth = doc.internal.pageSize.getWidth();
        let yPosition = 20;

        // Header
        doc.setFontSize(24);
        doc.setTextColor(41, 128, 185);
        doc.setFont('helvetica', 'bold');
        doc.text('AarogyaBytes AI', pageWidth / 2, yPosition, { align: 'center' });

        yPosition += 10;
        doc.setFontSize(18);
        doc.setTextColor(0, 0, 0);
        doc.text('Health Assessment Report', pageWidth / 2, yPosition, { align: 'center' });

        yPosition += 20;

        // Patient Information Section
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(52, 73, 94);
        doc.text('Patient Information', 20, yPosition);
        yPosition += 10;

        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        doc.text(`Name: ${patientName}`, 20, yPosition);
        yPosition += 7;
        doc.text(`Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 20, yPosition);
        yPosition += 7;
        doc.text(`Time: ${new Date().toLocaleTimeString('en-US')}`, 20, yPosition);
        yPosition += 7;
        doc.text(`Session ID: ${this.sessionData.sessionId}`, 20, yPosition);
        yPosition += 15;

        // Add separator line
        doc.setDrawColor(200, 200, 200);
        doc.line(20, yPosition, pageWidth - 20, yPosition);
        yPosition += 15;

        // Assessment Results Section
        if (this.sessionData.assessmentResult) {
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(52, 73, 94);
            doc.text('Assessment Results', 20, yPosition);
            yPosition += 10;

            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(0, 0, 0);

            doc.text(`Condition: ${this.sessionData.assessmentResult.condition}`, 20, yPosition);
            yPosition += 7;

            // Urgency level with color
            const urgencyLevel = this.sessionData.assessmentResult.urgency.toUpperCase();
            const urgencyColors = {
                'EMERGENCY': [220, 53, 69],
                'HIGH': [253, 126, 20],
                'MODERATE': [255, 193, 7],
                'LOW': [40, 167, 69]
            };
            const color = urgencyColors[urgencyLevel] || [0, 0, 0];
            doc.setTextColor(color[0], color[1], color[2]);
            doc.setFont('helvetica', 'bold');
            doc.text(`Urgency Level: ${urgencyLevel}`, 20, yPosition);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(0, 0, 0);
            yPosition += 7;

            doc.text(`Severity Score: ${this.sessionData.assessmentResult.severity}/10`, 20, yPosition);
            yPosition += 15;

            // Add separator line
            doc.setDrawColor(200, 200, 200);
            doc.line(20, yPosition, pageWidth - 20, yPosition);
            yPosition += 15;
        }

        // Recommendations Section - ALWAYS USE ENGLISH
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(52, 73, 94);
        doc.text('Recommendations', 20, yPosition);
        yPosition += 10;

        if (this.sessionData.assessmentResult && this.sessionData.assessmentResult.recommendations) {
            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(0, 0, 0);

            // Get English recommendations by temporarily switching language
            const originalLanguage = this.currentLanguage;
            this.currentLanguage = 'EN';
            const englishRecommendations = this.getRecommendations(this.sessionData.assessmentResult.urgency);
            this.currentLanguage = originalLanguage;

            englishRecommendations.forEach((rec, index) => {
                const lines = doc.splitTextToSize(`${index + 1}. ${rec}`, pageWidth - 40);
                lines.forEach(line => {
                    if (yPosition > 270) {
                        doc.addPage();
                        yPosition = 20;
                    }
                    doc.text(line, 25, yPosition);
                    yPosition += 6;
                });
                yPosition += 3;
            });
        }

        // Add some space before disclaimer
        yPosition += 10;

        // Disclaimer Section
        if (yPosition > 240) {
            doc.addPage();
            yPosition = 20;
        }

        // Add separator line
        doc.setDrawColor(200, 200, 200);
        doc.line(20, yPosition, pageWidth - 20, yPosition);
        yPosition += 10;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(192, 57, 43);
        doc.text('Medical Disclaimer', 20, yPosition);
        yPosition += 7;

        doc.setFont('helvetica', 'italic');
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        const disclaimer = 'This AI assessment provides general health information only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read in this report.';
        const disclaimerLines = doc.splitTextToSize(disclaimer, pageWidth - 40);
        disclaimerLines.forEach(line => {
            if (yPosition > 280) {
                doc.addPage();
                yPosition = 20;
            }
            doc.text(line, 20, yPosition);
            yPosition += 4;
        });

        // Footer
        yPosition += 10;
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(150, 150, 150);
        doc.text('Generated by AarogyaBytes AI - Your Smart Health Assistant', pageWidth / 2, yPosition, { align: 'center' });
    }

    showAnalytics() {
        this.updateAnalyticsDisplay();
        document.getElementById('analyticsPanel').classList.remove('hidden');
    }

    hideAnalytics() {
        document.getElementById('analyticsPanel').classList.add('hidden');
    }

    updateAnalyticsDisplay() {
        document.getElementById('consultationsCount').textContent = this.analyticsData.totalConsultations;
        document.getElementById('emergencyCount').textContent = this.analyticsData.emergencyAlerts;
        document.getElementById('sessionTime').textContent = `${this.analyticsData.avgSessionTime} min`;
        
        // Update symptoms list
        const symptomsList = document.getElementById('symptomsList');
        symptomsList.innerHTML = '';
        
        Object.entries(this.analyticsData.commonSymptoms).forEach(([symptom, count]) => {
            const item = document.createElement('div');
            item.className = 'symptom-item';
            item.innerHTML = `<span>${symptom}</span><span>${count}</span>`;
            symptomsList.appendChild(item);
        });
        
        // Update urgency chart
        const urgencyChart = document.getElementById('urgencyChart');
        urgencyChart.innerHTML = '';
        
        Object.entries(this.analyticsData.urgencyDistribution).forEach(([level, count]) => {
            const bar = document.createElement('div');
            bar.className = 'urgency-bar';
            
            const percentage = (count / this.analyticsData.totalConsultations) * 100 || 0;
            
            bar.innerHTML = `
                <div class="urgency-label">${level}</div>
                <div class="urgency-progress">
                    <div class="urgency-fill" style="width: ${percentage}%; background-color: ${this.medicalData.urgencyLevels[level]?.color || '#ccc'}"></div>
                </div>
            `;
            urgencyChart.appendChild(bar);
        });
    }

    updateAnalytics(event, data = null) {
        switch (event) {
            case 'session_started':
                this.analyticsData.totalConsultations++;
                break;
            case 'message_sent':
                // Track message activity
                break;
            case 'assessment_completed':
                if (data) {
                    this.analyticsData.urgencyDistribution[data] = (this.analyticsData.urgencyDistribution[data] || 0) + 1;
                }
                break;
            case 'emergency_detected':
                this.analyticsData.emergencyAlerts++;
                break;
            case 'report_generated':
                this.analyticsData.reportsGenerated++;
                break;
        }
        
        this.saveAnalytics();
    }

    loadAnalytics() {
        // In a real app, this would load from a backend
        return {
            totalConsultations: 1247,
            emergencyAlerts: 23,
            avgSessionTime: 8.5,
            reportsGenerated: 892,
            commonSymptoms: {
                'Fever/बुखार': 342,
                'Headache/सिर दर्द': 298,
                'Cough/खांसी': 267,
                'Stomach pain/पेट दर्द': 189,
                'Body ache/बदन दर्द': 156
            },
            urgencyDistribution: {
                'low': 45,
                'moderate': 30,
                'high': 20,
                'emergency': 5
            }
        };
    }

    saveAnalytics() {
        // In a real app, this would save to a backend
        console.log('Analytics updated:', this.analyticsData);
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.aarogyaBytes = new AarogaByteAI();
});