require("dotenv").config();
const axios = require("axios");
// Replace with your bot token
const botToken = process.env.BOT_API_KEY;
// Replace with the group chat ID (make sure to use a numeric chat ID)
const chatId = process.env.YOUR_GROUP_CHAT_ID;
// Replace with the user ID you want to check
// const userIdToCheck = "USER_ID_TO_CHECK";

// Function to get information about a chat member
async function getChatMember(userId) {
  console.log("userid", userId);
  const url = `https://api.telegram.org/bot${botToken}/getChatMember?chat_id=${chatId}&user_id=${userId}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    // console.error("Error fetching chat member:", error);
    return null;
  }
}

// Function to check if the user is in the group
async function checkIfUserIsInGroup(userIdToCheck) {
  const data = await getChatMember(userIdToCheck);
  console.log("data", data);
  if (data && data.ok) {
    console.log(`User is in the group. Status: ${data.result.status}`);
    return true;
  } else {
    console.log("User is not in the group or an error occurred.");
    return false;
  }
}

// Function to get Instagram subscriptions
async function getSubscriptions() {
  const url = `https://graph.instagram.com/me/subscriptions?access_token=${process.env.ACCESS_TOKEN_INSTAGRAM}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return null;
  }
}

// Function to check and log subscriptions
async function checkSubscriptions() {
  const subscriptions = await getSubscriptions();
  console.log("subscriptions", subscriptions);
  if (subscriptions && subscriptions.data) {
    console.log("Your Instagram API subscriptions:", subscriptions.data);
  } else {
    console.log("No subscriptions found or an error occurred.");
  }
}

// Execute the function to check if the user is in the group
module.exports = {
  checkIfUserIsInGroup,
  checkSubscriptions,
};
