const axios = require("axios");

const x = process.env.FLOUCI_SECRET
console.log(x , "x");

module.exports = {
  Add: async (req, res) => {
    const url =  "https://developers.flouci.com/api/generate_payment"
    const payload = {
      app_token: "894a54f7-3f74-42ac-a4a1-91930ac0cd54", 
      app_secret: process.env.FLOUCI_SECRET,
      amount: req.body.amount,
      accept_card: true,
      session_timeout_secs: 1200,
      success_link: "http://localhost:3000/Success", 
      fail_link: "http://localhost:3000/Failed",     
      developer_tracking_id: "b6e1e180-32d9-47ca-97e0-b591631c008f", 
    };

    try {
      const result = await axios.post(url, payload);

      if (result.status === 200) {
        res.status(200).json(result.data); 
      } else {
        console.error("Unexpected status code:", result.status);
        res.status(500).send("Unexpected error with Flouci response");
      }
    } catch (error) {
      if (error.response) {
        console.error("Flouci Error:", error.response.status);
        console.error("Details:", error.response.data);
        res.status(error.response.status).json(error.response.data);
      } else if (error.request) {
        console.error("No response from Flouci");
        res.status(500).send("No response from Flouci server");
      } else {
        console.error("Request setup error:", error.message);
        res.status(500).send("Internal server error");
      }
    }
  },
   verify : async (req, res) => {
    const paymentId = req.params.paymentId 
  console.log(paymentId , "s");
  
    if (!paymentId) {
      return res.status(400).json({ status: 'error', message: 'Missing payment ID' });
    }
  
 
      const url = `https://developers.flouci.com/api/verify_payment/${paymentId}`;
  
      const headers = {
        'Content-Type': 'application/json',
        'apppublic': '894a54f7-3f74-42ac-a4a1-91930ac0cd54',  
        'appsecret': x  
      };
    
      try {
        const response = await axios.get(url, { headers });
  
      console.log('Flouci Verification Response:', response.data); 
  
      if (response.data.result.status === 'SUCCESS') {
        return res.json({ status: 'success' });
      } 
    } catch (error) {
      console.error("Error verifying payment:", error.response ? error.response.data : error.message);
      return res.status(500).json({ status: 'error', message: 'Server error' });
    } }
    
  
};
