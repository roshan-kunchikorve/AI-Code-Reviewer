import { useState, useEffect } from "react";
import "prismjs/themes/prism-tomorrow.css";
import EditorImport from "react-simple-code-editor";
import prism from "prismjs";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from "axios";
import "./App.css";

// Fix for Vite CJS/ESM default export issue with react-simple-code-editor
const Editor = EditorImport.default || EditorImport;

function App() {
  const [code, setCode] = useState(`function sum() {\n  return 1 + 1\n}`);
  const [review, setReview] = useState(``);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    prism.highlightAll();
  }, []);

   async function reviewCode() {
    setLoading(true);
    setReview("⏳ Analyzing your code...");
    try {
      const response = await axios.post("http://localhost:3000/ai/get-review", {
        code,
      });

      const data = response.data;

      // Ensure we pass a string to setReview
      if (typeof data === "string") {
        setReview(data);
      } else if (typeof data === "object" && data !== null) {
        // Adjust property names below based on what your backend returns
        setReview(
          data.review || 
          data.response || 
          data.message || 
          data.text || 
          JSON.stringify(data, null, 2)
        );
      }
    } catch (error) {
      console.error(error);
      setReview(
        "❌ Error fetching review. Please make sure the backend server is running.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <div className="left">
        <div className="code">
          <Editor
            value={code}
            onValueChange={(code) => setCode(code)}
            highlight={(code) =>
              prism.highlight(code, prism.languages.javascript, "javascript")
            }
            padding={16}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 16,
              border: "none",
              height: "100%",
              width: "100%",
            }}
          />
        </div>
        <button onClick={reviewCode} disabled={loading} className="review">
          {loading ? "Reviewing..." : "Review"}
        </button>
      </div>
      <div className="right">
        <Markdown rehypePlugins={[rehypeHighlight]}>
          {review ||
            "👈 Write or paste your code on the left and click **Review** to get AI-powered feedback!"}
        </Markdown>
      </div>
    </main>
  );
}

export default App;
