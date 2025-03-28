import Schedule from "@/features/schedule/schedule";

const West = () => {
    return ( 
        <div className="pt-2">
            <h1 className="text-center font-bold text-3xl text-gray-800">West District</h1>
            <Schedule location="West" />
        </div>
     );
}
 
export default West;