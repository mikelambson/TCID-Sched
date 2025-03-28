import Schedule from "@/features/schedule/schedule";

const East = () => {
    return ( 
        <div className="pt-2">
            <h1 className="text-center font-bold text-3xl text-gray-800">East District</h1>
            <Schedule location="East" />
        </div>
     );
}
 
export default East;