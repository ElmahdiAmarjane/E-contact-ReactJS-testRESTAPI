
import axios from "axios";
import Navbar from "../navbar/Navbar";
import { useEffect, useState } from "react";
import removeicon from "../../assets/icons/iconremovewhite.png"
import verifyicon from "../../assets/icons/iconeverify.png"
import searchicon from "../../assets/icons/iconsearchlignt.png"
import DeleteConfirm from "../popups/DeleteConfirm.jsx"
import Updatesuccess from "../popups/Updatesuccess.jsx";
const ManageUsers =  ()=>{
         const [allUsers,setAllUsers ]= useState([]);
         const [removeClicked , setRemoveClicked ]=useState(false); 
         const [itemClickedTORemove,setItemClickedToRemove]=useState(null);
         const [email,setEmail]=useState();
         const [updatesuccess,setUpdateSuccess] = useState(false);
         const [nbrContacts, setNbrContacts] = useState({});
      const getAllUsers= async ()=>{
            
         await axios.post("http://localhost:9080/e-contact/api/v1/admin/all" )
                 .then((res)=>{

                  if(res.data!=null){
                    console.log(res.data)
                      setAllUsers(res.data);
                  }

             })

      }
      
      useEffect(()=>{getAllUsers()},[]);
      
      const removeClickedFunc=(user)=>{
               setRemoveClicked(true);
               setItemClickedToRemove(user);
      }

      const searchUserByEmail=(e)=>{
            const email = e.target.value;
            console.log("email : ",email)
             axios.post("http://localhost:9080/gnote/api/gnotes/v1/admin/searchUser",
             {
               email : email
             }).then((res)=>{
                 console.log("reddddddd ",res.data);
                 setAllUsers(res.data);
             }
                
             ).catch( error => 
                {console.log(error)}
             )
      }

      const acceptUser=(user)=>{
             console.log("user to change validity : ", user.isValide)
             const newValidaty = !user.isValide;
             console.log("user  new validity : ", newValidaty)
             console.log("user  :",user)
           axios.post("http://localhost:9080/e-contact/api/v1/admin/update",{
               id:user.id,
               isValide:newValidaty,
               login:user.login,
               isAdmin:user.isAdmin
           }).then((res)=>{
                console.log(res.data);
                setUpdateSuccess(true);
                getAllUsers();
           })
      } 

      const updateUser=(user)=>{
    
        console.log("user  :",user)
      axios.post("http://localhost:9080/e-contact/api/v1/admin/update",{
          id:user.id,
          isValide: user.isValide,
          login:user.login,
          isAdmin:user.isAdmin
      }).then((res)=>{
           console.log(res.data);
           setUpdateSuccess(true);
           getAllUsers();
      })
 } 
         const onchangelogin = (e,user)=>{
            setEmail(e.target.value);
            user.login = e.target.value;
         } 

         setTimeout(function() {
            if(updatesuccess)
            setUpdateSuccess(false);
        }, 3000);


        // const getnbrcontacts = async (user)=>{
        //     console.log("user id to  : ",user.id)
        //    await  axios.post("http://localhost:9080/e-contact/api/v1/contact/nbrcontacts",{
        //         id:user.id,
                
        //     }).then((res)=>{
        //          console.log(res.data);
        //          return res.data;
        //     })
        // }
        const getnbrcontacts = async (user) => {
            console.log("user id to  : ", user.id);
            try {
                const response = await axios.post("http://localhost:9080/e-contact/api/v1/contact/nbrcontacts", {
                    id: user.id,
                });
                console.log(response.data);
                return response.data;
            } catch (error) {
                console.error("Error:", error);
                return null; // Handle error gracefully
            }
        };
        
        useEffect(() => {
            const fetchNbrContacts = async () => {
                const nbrContactsMap = {};
                await Promise.all(
                    allUsers.map(async (user) => {
                        const nbr = await getnbrcontacts(user);
                        nbrContactsMap[user.id] = nbr;
                    })
                );
                setNbrContacts(nbrContactsMap);
            };
    
            fetchNbrContacts();
        }, [allUsers]);
    
        

     return (

        <>
          
      <Navbar/>
       <h1 className="text-center font-100">All users </h1>
        <div className="search  flex  justify-center mt-[50px]">
         <div className=" w-[50%] bg-green flex border-2 rounded-md  border-gray-500 bg-gray-300   justify-center align-center">
             <img src={searchicon} alt="" className=" w-[28px] h-[28px] mt-4  "/>
             <input onChange={(e)=>{searchUserByEmail(e)}} type="text" className="w-[500px] h-[60px] outline-none  bg-gray-300 pl-4 " placeholder="Search by email" />
         </div>
           
        </div>
 
   <div className="relative mb-10 overflow-x-auto shadow-md sm:rounded-lg mt-[20px]">
    <table className="w-200 m-auto  text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                
                <th scope="col"  className=" px-6 py-3">
                    User Email
                </th>
               
                <th scope="col" className="px-6 py-3">
                   nbr contacts
                </th>
                <th scope="col" className="px-6 py-3">
                    isAdmin
                </th>
                <th scope="col" className="px-6 py-3">
                    isVerify
                </th>
                
                <th scope="col" className="px-0 py-0">
                    Accept or Remove
                </th>
            </tr>
        </thead>
        <tbody>

           {allUsers.length>0? allUsers.map((user , index)=>(
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
             
             <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
             <div className="flex items-center">
                     <input onChange={(e)=>onchangelogin(e,user)} className="px-6 py-1 rounded-sm bg-gray-800 border-2 border-gray-500" type="text" value={user.login} />
                      <a onClick={()=>updateUser(user)} className="ml-2 text-blue-600 dark:text-blue-500 hover:underline ">Update</a>
              </div>
             </td>
             <td className="px-6 py-4">
                 {<p > {nbrContacts[user.id]}</p>}
               
             </td>
             <td className="px-6 py-4">
                 {user.admin?<p >YES</p>:<p>NO</p>}
             </td>
             <td className="px-6 py-4">
             {user.isValide?<img src={verifyicon} className="w-5"/>:<p className="text-rose-500">Not verify</p>}
             </td>
            
             
           
             <td className="flex items-center px-2 py-2">
                 <a onClick={()=>{acceptUser(user)}} className="font-medium text-blue-600 dark:text-blue-500 hover:underline ml-5 px-2 py-4  "> {user.isValide? <p className=" ">Denied</p>: <p>Accept</p> }</a>
                 <img onClick={()=>{removeClickedFunc(user)}} src={removeicon} alt="" className="w-5 ml-10 py-4 " />
             </td>
         </tr>

           )):<td className=" text-black flex items-center px-2 py-4">No users to show</td>}
            
           
           
   
     
           

        </tbody>
    </table>
   
</div>
{updatesuccess?<Updatesuccess/>:null}
{removeClicked? (<>
          <DeleteConfirm 
          setRemoveClicked = {setRemoveClicked} 
          userToRemove = {itemClickedTORemove}
          getAllUsers = {getAllUsers}
          />
      
      </>)
      :(<></>)
      }
        </>
     )


}
export default ManageUsers;