import Schedule from "@/features/schedule/schedule";

const Truckee = () => {
    return ( 
        <div className="pt-2">
            <h1 className="text-center font-bold text-3xl text-gray-800">Truckee Canal District</h1>
            <Schedule location="Fernley" />
        </div>
     );
}
 
export default Truckee;