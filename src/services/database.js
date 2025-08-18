import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Collection names
const COLLECTIONS = {
  PANTRY_ITEMS: 'pantryItems',
  USERS: 'users'
};

// Pantry Items Operations
export const pantryService = {
  // Add a new pantry item
  async addItem(userId, itemData) {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.PANTRY_ITEMS), {
        ...itemData,
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return { id: docRef.id, ...itemData };
    } catch (error) {
      console.error('Error adding item:', error);
      throw new Error('Failed to add item to database');
    }
  },

  // Get all pantry items for a user
  async getItems(userId) {
    try {
      const q = query(
        collection(db, COLLECTIONS.PANTRY_ITEMS),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const items = [];
      
      querySnapshot.forEach((doc) => {
        items.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return items;
    } catch (error) {
      console.error('Error fetching items:', error);
      throw new Error('Failed to fetch items from database');
    }
  },

  // Update a pantry item
  async updateItem(itemId, updateData) {
    try {
      const itemRef = doc(db, COLLECTIONS.PANTRY_ITEMS, itemId);
      await updateDoc(itemRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });
      
      return { id: itemId, ...updateData };
    } catch (error) {
      console.error('Error updating item:', error);
      throw new Error('Failed to update item in database');
    }
  },

  // Delete a pantry item
  async deleteItem(itemId) {
    try {
      await deleteDoc(doc(db, COLLECTIONS.PANTRY_ITEMS, itemId));
      return itemId;
    } catch (error) {
      console.error('Error deleting item:', error);
      throw new Error('Failed to delete item from database');
    }
  },

  // Get expiring items (within specified days)
  async getExpiringItems(userId, days = 7) {
    try {
      const q = query(
        collection(db, COLLECTIONS.PANTRY_ITEMS),
        where('userId', '==', userId)
      );
      
      const querySnapshot = await getDocs(q);
      const items = [];
      const today = new Date();
      const futureDate = new Date();
      futureDate.setDate(today.getDate() + days);
      
      querySnapshot.forEach((doc) => {
        const item = { id: doc.id, ...doc.data() };
        const expiryDate = new Date(item.expiryDate);
        
        if (expiryDate >= today && expiryDate <= futureDate) {
          items.push(item);
        }
      });
      
      return items.sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));
    } catch (error) {
      console.error('Error fetching expiring items:', error);
      throw new Error('Failed to fetch expiring items');
    }
  }
};

// User preferences operations
export const userService = {
  // Save user preferences
  async updateUserPreferences(userId, preferences) {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, userId);
      await updateDoc(userRef, {
        preferences,
        updatedAt: serverTimestamp()
      });
      
      return preferences;
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw new Error('Failed to update user preferences');
    }
  },

  // Get user preferences
  async getUserPreferences(userId) {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return userSnap.data().preferences || {};
      }
      
      return {};
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      throw new Error('Failed to fetch user preferences');
    }
  }
};