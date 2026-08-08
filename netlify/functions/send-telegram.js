exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" })
    };
  }

  try {
    const data = JSON.parse(event.body);

    const { name, phone, course, message } = data;

    if (!name || !phone || !course) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Name, phone and course are required"
        })
      };
    }

    const text =
`📩 NEW FREE LESSON REQUEST

👤 Name: ${name}
📞 Phone: ${phone}
📚 Course: ${course}
💬 Message: ${message || "—"}`;

    const response = await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: text
        })
      }
    );

    const result = await response.json();

    if (!result.ok) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Telegram error",
          details: result
        })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message
      })
    };
  }
};
