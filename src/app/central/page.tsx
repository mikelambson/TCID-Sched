import Schedule from "@/features/schedule/schedule";

const Central = () => {
    return ( 
        <div className="pt-2">
            <h1 className="text-center font-bold text-3xl text-gray-800">Central District</h1>
            <Schedule location="Central" />
        </div>
     );
}
 
export default Central;