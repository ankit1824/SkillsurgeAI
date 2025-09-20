# 🎓 AI Course Generator

<div align="center">
  <img width="1200" height="475" alt="AI Course Generator Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

An intelligent course generation platform that creates personalized learning experiences by analyzing user preferences, learning styles, and educational goals through AI-powered assessments and content generation.

## ✨ Features

### 🧠 AI-Powered Learning Style Assessment
- **Dynamic Assessment Generation**: Creates personalized questionnaires based on your chosen topic
- **Learning Style Detection**: Identifies your primary learning style (Visual, Auditory, Kinesthetic, Reading/Writing)
- **Adaptive Questions**: Questions are tailored to the specific subject matter you want to learn

### 📚 Personalized Course Creation
- **Custom Course Structure**: Generates comprehensive course outlines with modules, lessons, and sessions
- **Learning Style Integration**: Content is specifically designed for your identified learning style
- **Flexible Duration**: Choose course length from 1 to 52 weeks
- **Difficulty Levels**: Support for Beginner, Intermediate, Advanced, and Expert levels

### 🎯 Interactive Session Experience
- **Detailed Session Content**: Rich, markdown-formatted learning materials
- **Key Concepts Highlighting**: Important concepts are clearly identified and explained
- **Practical Activities**: Hands-on exercises tailored to your learning style
- **Visual Concept Maps**: Interactive mind maps to visualize relationships between concepts
- **Progress Tracking**: Clear progress indicators throughout the learning journey

### 🎨 Modern User Interface
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Dark Mode Support**: Automatic dark/light theme switching
- **Smooth Animations**: Polished user experience with smooth transitions
- **Accessibility**: Built with accessibility best practices in mind

## 🚀 Technology Stack

- **Frontend**: React 19.1.1 with TypeScript
- **Build Tool**: Vite 6.2.0
- **Styling**: Tailwind CSS
- **AI Integration**: Google Gemini AI (Gemini 2.5 Flash)
- **Markdown Rendering**: React Markdown
- **Icons**: Custom SVG icon components

## �� Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (version 18 or higher)
- **npm** or **yarn**
- **Google Gemini API Key** (get one from [Google AI Studio](https://aistudio.google.com/))

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd SkillsurgeAI
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```bash
# .env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Start the Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📖 Usage Guide

### Step 1: Course Input
1. Enter your desired course topic (e.g., "Quantum Computing", "Machine Learning", "Digital Marketing")
2. Select the course duration in weeks (1-52)
3. Choose your preferred difficulty level
4. Click "Start Learning" to begin

### Step 2: Learning Style Assessment
1. Answer 5 multiple-choice questions designed to identify your learning style
2. Questions are dynamically generated based on your chosen topic
3. Each question has 4 options corresponding to different learning styles

### Step 3: Course Generation
1. The AI analyzes your responses to determine your learning style
2. A personalized course structure is generated based on your preferences
3. The course is organized into modules, lessons, and sessions

### Step 4: Learning Experience
1. Browse through the generated course structure
2. Click on any session to access detailed content
3. Explore key concepts, activities, and concept maps
4. Use the back navigation to return to the course outline

## 🏗️ Project Structure

```
SkillsurgeAI/
├── components/           # React components
│   ├── AssessmentQuiz.tsx    # Learning style assessment component
│   ├── CourseDisplay.tsx     # Course structure display
│   ├── CourseInputForm.tsx   # Initial course parameters form
│   ├── Icons.tsx            # Custom SVG icon components
│   ├── SessionView.tsx      # Individual session content view
│   └── SvgMindmap.tsx       # Interactive concept map component
├── services/            # API and external service integrations
│   └── geminiService.ts     # Google Gemini AI service
├── types.ts            # TypeScript type definitions
├── App.tsx             # Main application component
├── index.tsx           # Application entry point
├── index.html          # HTML template
├── vite.config.ts      # Vite configuration
├── tsconfig.json       # TypeScript configuration
└── package.json        # Project dependencies and scripts
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🎨 Customization

### Adding New Learning Styles
1. Update the `LearningStyle` enum in `types.ts`
2. Add corresponding icons in `Icons.tsx`
3. Update the assessment generation logic in `geminiService.ts`

### Styling Modifications
- The project uses Tailwind CSS for styling
- Custom animations are defined in `index.html`
- Component-specific styles are co-located with components

### AI Model Configuration
- Change the AI model in `geminiService.ts`
- Modify prompts to adjust content generation behavior
- Update response schemas for different output formats

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** for providing the AI capabilities
- **React** and **Vite** teams for the excellent development tools
- **Tailwind CSS** for the utility-first CSS framework
- **React Markdown** for markdown rendering capabilities

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-username/SkillsurgeAI/issues) page
2. Create a new issue with detailed information
3. Contact the development team

---

<div align="center">
  <p>Built with ❤️ for personalized learning experiences</p>
  <p>View in AI Studio: <a href="https://ai.studio/apps/drive/1WmVmpC43r9n9QX1TwvHDLBc4TWmftk7T">AI Studio App</a></p>
</div>
