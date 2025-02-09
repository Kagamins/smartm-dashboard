import { supabase } from "../utils/dataBase";

export async function FetchAttendance(date, organization) {
    try {
        if (!date || !organization) {
            throw new Error("التاريخ والمنظمة مطلوبان");
        }

        // ✅ Convert date to filter for full-day range
        const startDate = `${date}T00:00:00.000Z`;
        const endDate = `${date}T23:59:59.999Z`;

        console.log("Fetching attendance for:", startDate, "to", endDate, "Organization:", organization);

        const { data: Attendance, error } = await supabase
            .from("Attendance")
            .select("*") // ✅ Ensure you fetch all relevant fields
            .gte("created_at", startDate) // ✅ Filter from the start of the day
            .lt("created_at", endDate) // ✅ Up to the end of the day
            .eq("organization", organization); // ✅ Ensure organization matches

        if (error) throw error;

        return { success: true, data: Attendance };

    } catch (error) {
        console.error("FetchAttendance Error:", error.message);
        return { success: false, error: error.message || "لا توجد بيانات" };
    }
}
