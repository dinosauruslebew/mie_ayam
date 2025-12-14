import { db } from './firebase';
import {
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy
} from 'firebase/firestore';
import { MenuItem } from '@/data/data';

const COLLECTION_NAME = 'menu_items';

// Helper to convert Firestore doc to MenuItem
// Note: Firestore ID is string, but our interface uses number for ID currently. 
// We might need to adjust the interface or cast the ID. 
// For this transition, let's keep the ID as string in the app or handle the conversion.
// BUT, the existing app uses validation for `number` IDs in some places.
// Strategy: Let's update `MenuItem` interface in `data/data.ts` to allow string IDs or handle it here.
// Actually, Firestore IDs are strings. It's best to switch the app to use string IDs. 
// However, to minimize refactoring, I will cheat slightly: I will NOT use the Firestore auto-generated ID as the `id` field in the object if I can avoid it, 
// OR better: I will update the app to accept string IDs which is the proper way for Firestore.

export const getMenuItems = async (): Promise<MenuItem[]> => {
    console.log("Firestore: getMenuItems called");
    try {
        const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        console.log(`Firestore: Fetched ${querySnapshot.size} items`);
        return querySnapshot.docs.map(doc => ({
            id: doc.id, // Use Firestore ID (string)
            ...doc.data()
        } as unknown as MenuItem));
        // We'll need to update MenuItem type to allow string id.
    } catch (error) {
        console.error("Firestore: Error getting items:", error);
        throw error;
    }
};

export const addMenuItem = async (item: Omit<MenuItem, 'id'> & { id?: string | number }) => {
    console.log("Adding item to Firestore:", item);
    try {
        // Create a copy and remove 'id' if it exists (even if undefined) to prevent Firestore error
        const { id, ...itemData } = item;

        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...itemData,
            createdAt: new Date()
        });
        console.log("Item added with ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error adding item to Firestore:", error);
        throw error;
    }
};

export const updateMenuItem = async (id: string | number, item: Partial<MenuItem>) => {
    console.log("Firestore: updateMenuItem called for ID:", id, item);
    try {
        // Ensure ID is string for Firestore
        const docRef = doc(db, COLLECTION_NAME, String(id));
        await updateDoc(docRef, item);
        console.log("Firestore: Item updated successfully");
    } catch (error) {
        console.error("Firestore: Error updating item:", error);
        throw error;
    }
};

export const deleteMenuItem = async (id: string | number) => {
    console.log("Firestore: deleteMenuItem called for ID:", id);
    try {
        const docRef = doc(db, COLLECTION_NAME, String(id));
        await deleteDoc(docRef);
        console.log("Firestore: Item deleted successfully");
    } catch (error) {
        console.error("Firestore: Error deleting item:", error);
        throw error;
    }
};
