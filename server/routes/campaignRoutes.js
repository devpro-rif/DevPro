const express = require("express");
const { 
    createCampaign, 
    updateCampaign, 
    getCampaign, 
    getAllCampaigns, 
    getCampaignsByUser, 
    getCampaignsByCommunity,
    deleteCampaign,
    getCampaignsByStatus,
    refreshAllCampaignStatuses
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

// Get campaigns by status
routerCampaign.get("/campaigns/status/:status", getCampaignsByStatus);

// Create campaign (requires authentication)
routerCampaign.post("/campaign/create", auth, createCampaign);

// Update campaign (requires authentication)
routerCampaign.put("/campaign/update/:id_campaign", auth, updateCampaign);

// Refresh all campaign statuses (requires authentication)
routerCampaign.put("/campaigns/refresh-statuses", auth, refreshAllCampaignStatuses);

// Delete campaign (requires authentication)
routerCampaign.delete("/campaign/delete/:id_campaign", auth, deleteCampaign);

module.exports = routerCampaign; 