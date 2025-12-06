import '../styles/Header.css'
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { pruneVm } from '../services/VmsApi';

interface HeaderProps {
    start: boolean
}

const Header:React.FC<HeaderProps> = ({start}) => {
    const [time,setTime] = useState({
        hour: 2,
        minute: 59,
        second: 60
    });

    const deleteAllVms = async () => {
            try{
                await pruneVm();
                window.localStorage.clear();
                window.location.href = "/";

            }catch(error:any){
                toast.warning(error.message);

            }
        }


    const handleLogout = () => {
        deleteAllVms();
    }


    useEffect(() => {

        const secondTimeout = setTimeout(() => {
                setTime(prev => ({
                    ...prev,
                    second: prev.second-1
                })
         )}, 1000);

        if (time.second === 0){
            setTime(prev => ({
                    ...prev,
                    minute: prev.minute-1,
                    second: 60
                }))
        }

        if (time.minute === 0 && time.second === 0){
            setTime(prev => ({
                    ...prev,
                    hour: prev.hour-1,
                    minute: 59,
                    second: 60
                }))
        }
        if (time.hour === 0 && time.minute === 0 && time.second === 0){
            clearTimeout(secondTimeout);
            deleteAllVms();
        }

        return () => clearTimeout(secondTimeout);
    },[time])

    

    return (
            <div id="header-out">
                <div>{time.hour < 10 ? `0${time.hour}`: time.hour }:{time.minute < 10 ? `0${time.minute}` : time.minute}:{time.second < 10 ? `0${time.second}` : time.second }</div>
                <div>{ start ? "You can start Now creating vms" : "Wait a moment" }</div>
		<button onClick={handleLogout}>Logout</button>
            </div>
        )

}

export default Header;
