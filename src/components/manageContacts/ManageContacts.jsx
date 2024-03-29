import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../navbar/Navbar";
import NoteCard from "./NoteCard";
import EditNote from "./EditNote";
import { Navigate } from "react-router-dom";
import SearchNote from "./SearchNote";
import DeleteConfirm from "../popups/DeleteConfirm";
import AddNewNote from "./AddNewNote"
const ManageContacts = () => {
  const [allNotes, setAllNotes] = useState([]);
  const [isEditClicked, setEditClicked] = useState(false);
  const [hideEditPop, setHideEditPop] = useState(true);
  const [noteClicked, setNoteClicked] = useState(null);

  const getAllNotes = async () => {
    if (sessionStorage.getItem("currentUser") != null) {
      let id = sessionStorage.getItem("currentUserId");
      await axios
        .post("http://localhost:9080/e-contact/api/v1/contact/all", {
          id:id,
        })
        .then((res) => {
          setAllNotes(res.data);
        });
    } else {
      Navigate("/");
    }
  };

  useEffect(() => {
    getAllNotes();
  }, []);

  const isEditClickedHandler = (note) => {
    setEditClicked(true);
    setNoteClicked(note);
    setHideEditPop(true); // Ensure EditNote is visible when Edit is clicked
  };

  const cancelEditPop = () => {
    setHideEditPop(false);
  };

  const saveEdit = () => {
   
    setHideEditPop(false); // Hide EditNote after saving changes
  };
         const searchNote=(e)=>{
             const subject = e.target.value;
           axios.post("",
           {
             subject : subject
           }).then((res)=>{
               console.log("notes search",res.data);
               setAllNotes(res.data);
           }
              
           ).catch( error => 
              {console.log(error)}
           )
         }
  return (
    <>
      <Navbar />
      <h1>
        Welcome to manage your notes, normal user,{" "}
        {sessionStorage.getItem("currentUser")}
      </h1>
      <div>
        {/* <AddNewNote 
           getAllNotes={getAllNotes}
        /> */}
      </div>
      {/* <div className="w-[60%] m-auto">
        <SearchNote searchNote = {searchNote}/>
        </div> */}
  <div className="overflow-y-auto overflow-x-hidden sticky  right-0 flex  left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] ">
  {/* {isEditClicked ? (
        <EditNote
          note={noteClicked}
          hideEditPop={hideEditPop}
          cancelEditPop={cancelEditPop}
          saveEdit={saveEdit}
          getAllNotes={getAllNotes}
        />
      ) : null} */}
  </div>
      

        
      
      <div className="allNotes w-4/5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 m-auto mt-10">
        {allNotes.map((note, index) => (
          <NoteCard
            key={note.id}
            note={note}
            getAllNotes={getAllNotes}
            isEditClickedHandler={isEditClickedHandler}
          />
        ))}
      </div>
    </>
  );
};

export default ManageContacts;
