const inputText = document.getElementById("inputText");
const sourceLanguage = document.getElementById("sourceLanguage");
const targetLanguage = document.getElementById("targetLanguage");
const translateBtn = document.getElementById("translateBtn");
const outputText = document.getElementById("outputText");
const speakBtn = document.getElementById("speakBtn");

const languages = {
    en: "English",
    kn: "Kannada",
    hi: "Hindi",
    sp: "Spanish",
    fr: "French"
};

translateBtn.addEventListener("click", async () => {

    const text = inputText.value.trim();
    const source = sourceLanguage.value;
    const target = targetLanguage.value;

    if (text === "") {
        outputText.textContent = "Please enter some text.";
        return;
    }

    if (source === target) {
        outputText.textContent = text;
        return;
    }

    outputText.textContent = "Translating...";
    translateBtn.disabled = true;

    try {

        const sourceName = languages[source];
        const targetName = languages[target];

        const prompt = `
Translate the following text from ${sourceName} to ${targetName}.

IMPORTANT:
- Give only the translation.
- Do not explain anything.
- Keep the original meaning.

Text:
${text}
`;

        console.log("Sending translation request...");

        const response = await puter.ai.chat(prompt, {
            model: "gpt-5.4-nano"
        });

        console.log("Puter response:", response);

        let translation;

        if (typeof response === "string") {
            translation = response;
        } 
        else if (response && response.message) {
            translation = response.message.content;
        } 
        else {
            translation = String(response);
        }

        outputText.textContent = translation;

    } catch (error) {

        console.error("Translation error:", error);

        outputText.textContent =
            "Translation failed. Check the browser console.";

    } finally {

        translateBtn.disabled = false;

    }
});

speakBtn.addEventListener("click", () => {
    const text = outputText.textContent.trim();

    if (!text || text === "Your translated text will appear here...") {
        alert("Please translate some text first.");
        return;
    }

    const speech = new SpeechSynthesisUtterance(text);

    speech.lang = targetLanguage.value;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
});