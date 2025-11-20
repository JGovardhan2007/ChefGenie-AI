# ChefGenie AI 👨‍🍳✨

**ChefGenie AI** is an intelligent recipe generator that transforms your available ingredients into delicious, complete meals. Powered by Google's **Gemini 2.5 Flash** for culinary logic and **Imagen 4** for dynamic food photography, it helps reduce food waste and simplifies meal planning.

![ChefGenie Screenshot](https://via.placeholder.com/800x400?text=ChefGenie+AI+Preview)

## 🚀 Features

- **🥗 Intelligent Recipe Generation**: Input the ingredients you have in your fridge, and ChefGenie creates a structured recipe including steps, timings, and calorie counts.
- **🚫 Dietary Control**: Handle allergies and dietary restrictions (e.g., Gluten-free, Peanut-free) effortlessly.
- **📸 Dynamic Visuals**: Uses **Imagen 4.0** to generate high-resolution, appetizing images of the generated dish on the fly.
- **❤️ Health Analysis**: Provides a health score (1-10), summarizes nutritional pros/cons, and offers a brief health summary.
- **🔄 Smart Substitutions**: Automatically suggests ingredient substitutions if a recipe requires something you might not have.
- **⚡ Quick Add**: Rapidly select common ingredients from categorized lists (Proteins, Grains, Veggies, etc.).

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS
- **AI & ML**: 
  - Google Gemini 2.5 Flash (Text & Logic)
  - Imagen 4.0 (Image Generation)
- **Icons**: Lucide React

## 📦 Installation & Setup

To run this project locally, follow these steps:

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/chefgenie-ai.git
   cd chefgenie-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory and add your Google Gemini API key:
   ```env
   # Get your key from https://aistudio.google.com/
   API_KEY=your_actual_api_key_here
   ```
   *Note: Depending on your build tool (Vite, CRA, etc.), you might need to prefix this variable (e.g., `VITE_API_KEY`) and update `services/geminiService.ts` accordingly.*

4. **Run the application**
   ```bash
   npm start
   # or
   npm run dev
   ```

## 📂 Project Structure

```
chefgenie-ai/
├── components/          # UI Components
│   ├── IngredientInput.tsx
│   └── RecipeCard.tsx
├── services/            # API Integrations
│   └── geminiService.ts # Gemini & Imagen logic
├── types.ts             # TypeScript Interfaces
├── App.tsx              # Main Application Logic
├── index.html           # Entry HTML
├── index.tsx            # React Entry Point
└── metadata.json        # App Metadata
```

## 💡 How It Works

1. **Input**: Users enter a list of ingredients (e.g., "chicken, rice, tomato").
2. **Prompting**: The app constructs a detailed prompt for `gemini-2.5-flash`, enforcing JSON output constraints for structure.
3. **Generation**: 
   - The LLM returns a JSON object containing the recipe details, instructions, and health analysis.
   - Simultaneously, a prompt is sent to `imagen-4.0` to generate a visual representation of the dish description.
4. **Rendering**: The data is parsed and displayed in a beautiful, responsive recipe card.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*Built with ❤️ using React and Google Gemini API*
