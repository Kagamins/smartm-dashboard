import { supabase } from "../utils/dataBase";

export async function FetchAbscense(date, organization) {
    try {
        if (!date || !organization) {
            throw new Error("التاريخ والمنظمة مطلوبان");
        }

        // ✅ Convert date to correct format (YYYY-MM-DD)
 
        console.log("Fetching Statements for Date:", date, "Organization:", organization);

        const { data: statements, error } = await supabase
            .from("statements") // ✅ Ensure correct table name
            .select("*")
            .eq("organization", organization) // ✅ Match organization
            .eq("created_at", date) 
 
        if (error) throw error;

        console.log("Fetched Statements:", statements);
        return { success: true, data: statements };

    } catch (error) {
        console.error("Fetch Abscense Error:", error.message);
        return { success: false, error: error.message || "لا توجد بيانات" };
    }
}
