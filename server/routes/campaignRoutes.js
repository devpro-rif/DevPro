const express = require("express");
const { 
    createCampaign, 
    updateCampaign, 
    getCampaign, 
    getAllCampaigns, 
    getCampaignsByUser, 
    getCampaignsByCommunity,
    linkCampaignToCommunities,
    deleteCampaign 
} = require("../controllers/campaignController");
const auth = require("../middleware/authMiddleware");
const routerCampaign = express.Router();

// Campaign routes

// Get campaign by ID
routerCampaign.get("/campaign/:id_campaign", getCampaign);

// Get all campaigns
routerCampaign.get("/campaigns/all", getAllCampaigns);

// Get campaigns by user
routerCampaign.get("/campaigns/user/:id_user", getCampaignsByUser);

// Get campaigns by community
routerCampaign.get("/campaigns/community/:id_community", getCampaignsByCommunity);

// Create campaign (requires authentication)
routerCampaign.post("/campaign/create", auth, createCampaign);

// Update campaign (requires authentication)
routerCampaign.put("/campaign/update/:id_campaign", auth, updateCampaign);

// Link campaign to communities (requires authentication)
routerCampaign.post("/campaign/:id_campaign/link-communities", auth, linkCampaignToCommunities);

// Delete campaign (requires authentication)
routerCampaign.delete("/campaign/delete/:id_campaign", auth, deleteCampaign);

module.exports = routerCampaign; 