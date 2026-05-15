const chatBody = document.getElementById("chatBody");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

// Your n8n Webhook URL
const WEBHOOK_URL =
  "https://huzaifa2510.app.n8n.cloud/webhook/friendly-chat";

// Add Message
function addMessage(message, sender) {

  const messageDiv = document.createElement("div");

  messageDiv.classList.add("message", sender);

  messageDiv.innerHTML = `
    <div class="bubble">
      ${message}
    </div>
  `;

  chatBody.appendChild(messageDiv);

  scrollToBottom();
}

// Show Typing Animation
function showTyping() {

  const typingDiv = document.createElement("div");

  typingDiv.classList.add("message", "ai");
  typingDiv.id = "typingIndicator";

  typingDiv.innerHTML = `
    <div class="bubble">
      <div class="typing">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  `;

  chatBody.appendChild(typingDiv);

  scrollToBottom();
}

// Remove Typing Animation
function removeTyping() {

  const typingIndicator =
    document.getElementById("typingIndicator");

  if (typingIndicator) {
    typingIndicator.remove();
  }
}

// Auto Scroll
function scrollToBottom() {
  chatBody.scrollTop = chatBody.scrollHeight;
}

// Send Message
async function sendMessage() {

  const message = messageInput.value.trim();

  if (message === "") return;

  // Add User Message
  addMessage(message, "user");

  // Clear Input
  messageInput.value = "";

  // Show Typing Animation
  showTyping();

  try {

    // Send Message To n8n
    const response = await fetch(WEBHOOK_URL, {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        message: message
      })

    });

    // Convert Response To JSON
    const data = await response.json();

    // Remove Typing
    removeTyping();

    // Get AI Reply
    const aiReply =
      data.reply || "No response from AI.";

    // Add AI Message
    addMessage(aiReply, "ai");

  } catch (error) {

    console.log("Webhook Error:", error);

    removeTyping();

    addMessage(
      "Sorry, AI connection failed 😢",
      "ai"
    );
  }
}

// Send Button
sendBtn.addEventListener("click", sendMessage);

// Enter Key
messageInput.addEventListener("keypress", function (e) {

  if (e.key === "Enter") {
    sendMessage();
  }

});