const db = require("../../../db");
const config = require("../../../fb/config");
const authornot = require("../../../middleware/authCheck");

const customerRequestResolver = {
  Query: {
    getCustomerRequests: async (_, args, context) => {
      // Check authentication
      
      try {
        const customerRequestsRef = db.collection('customerRequests');
        const snapshot = await customerRequestsRef.get();
        
        if (snapshot.empty) {
          return [];
        }
        
        const customerRequests = [];
        snapshot.forEach(doc => {
          customerRequests.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        return customerRequests;
      } catch (error) {
        console.error("Error getting customer requests:", error);
        throw new Error("Failed to get customer requests");
      }
    }
  },
  
  Mutation: {
    addCustomerRequest: async (_, { customerRequestInput }) => {
      try {
        const customerRequestsRef = db.collection('customerRequests');
        
        // Save new customer request to Firestore
        await customerRequestsRef.add({
          ...customerRequestInput,
          createdAt: new Date().toISOString()
        });
        
        return {
          success: true,
          message: "Customer request added successfully"
        };
      } catch (error) {
        console.error("Error adding customer request:", error);
        return {
          success: false,
          message: `Failed to add customer request: ${error.message}`
        };
      }
    },
    
    deleteCustomerRequest: async (_, { id }, context) => {
      // Check authentication
      const authCheck = authornot(context);
      if (authCheck && authCheck.success === false) {
        return {
          success: false,
          message: "Authentication required"
        };
      }
      
      try {
        const customerRequestRef = db.collection('customerRequests').doc(id);
        
        // Check if document exists
        const doc = await customerRequestRef.get();
        if (!doc.exists) {
          return {
            success: false,
            message: "Customer request not found"
          };
        }
        
        // Delete the document
        await customerRequestRef.delete();
        
        return {
          success: true,
          message: "Customer request deleted successfully"
        };
      } catch (error) {
        console.error("Error deleting customer request:", error);
        return {
          success: false,
          message: `Failed to delete customer request: ${error.message}`
        };
      }
    }
  }
};

module.exports = customerRequestResolver;


