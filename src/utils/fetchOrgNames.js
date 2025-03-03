import { supabase } from "../utils/dataBase";

export async function fetchOrganizations(   ) {
    try {
         

        // ✅ Convert date to correct format (YYYY-MM-DD)
 

        const { data: orgnames, error } = await supabase
            .from("organization") // ✅ Ensure correct table name
            .select("name")
              // ✅ Match organization
  
        if (error) throw error;

        console.log("Fetched organizations :", orgnames);
        return { success: true, data: orgnames };

    } catch (error) {
        console.error("Fetch Abscense Error:", error.message);
        return { success: false, error: error.message || "لا توجد بيانات" };
    }
}
