import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../redux/apiCalls/usersApiCalls";
import User from "../components/User";
import ChatDialogue from "../components/ChatDialogue";

const Users = () => {

    const {users } = useSelector(state=>state.users);
    const { user} = useSelector(state=>state.auth);

    const[filteredUsers , setFilteredUsers] = useState([]);
    const[selectedUser , setSelectedUser] = useState(null);

    const dispatch = useDispatch();

    useEffect(()=>{
        const filtered = users.filter(singleUser=> user._id !== singleUser._id);
        setFilteredUsers(filtered);
        
       },[users]);

    useEffect(()=>{
     dispatch(getAllUsers());
     
    },[]);

    const handleUserClick = (userId) => { setSelectedUser(userId); };

    return (<>
    <h1 className="from-neutral-500">Users</h1>
    <ul>
        {filteredUsers.length > 0 && filteredUsers.map((user , index)=>(
            <User  key={index} currentUser={user}  onClick={() => handleUserClick(user._id)}/>
            ))}
    
    </ul>

    <ChatDialogue selectedUser= {selectedUser}/>
    
    </>  );
}
 
export default Users;