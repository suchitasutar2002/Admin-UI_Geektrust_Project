import React, { useEffect, useState, Fragment } from 'react'


import "./App.css"
import Api from "./Services/Api";
// import { DeleteSelectedBtn, SearchUser, EditableRow, DisplayRows, Pagination, Modal, Skeleton } from "./components/DeleteSelectedBtn";


import   SearchUser   from './components/SearchUser';
import  EditableRow   from './components/EditableRow';
import  DisplayRows   from './components/DisplayRows';
import   Pagination  from './components/Pagination';
import  Modal    from './components/Modal';
import  Skeleton    from './components/Skeleton';
import   DeleteSelectedBtn   from "./components/DeleteSelectedBtn";
// import icon from "./Images/icon.png";

function App () {

  //  Use state to show initial loading skeleton state.
  const [loading, setLoading] = useState(true);

  //  Use state to store the users data from the API call and set it to an empty array initially.
  const [users, setUsers] = useState([]);

  //  Use state to set the error to be true if the API call fails and set it to false if the API call succeeds.
  const [error, setError] = useState(false);

  //  Use state to store the edited user data and set it to an empty object initially.
  const [editUserForm, setEditUserForm] = useState({
    id: '',
    name: '',
    email: '',
    role: ''
  });

  //  use state to set the id of the user to be edited and set it to null initially.
  const [editUserId, setEditUserId] = useState();

  //  Use state to store the search text entered by the user and set it to an empty string initially.
  const [searchResult, setSearchResult] = useState('');

  //  Use state to store the current page number and set it to 1 initially.
  const [currentPage, setCurrentPage] = useState(1);

  //  Use state to store the number of users per page and set it to 10 initially.
  const [itemPerPage] = useState(10);

  //  Get the users from the API when the component mounts and set the users to the state using the setUsers() method.
  useEffect(() => {
    Api.getUsers()

    .then(data => { 
      setError(false) 
      setUsers(data)
      console.log(data);
    })
    .catch(error => setError(true))
    .finally(setLoading(false));
  }, []); //  [] is used to tell React that this effect should only run once.

  //  Checked all the users in the current page and set the users to the state using the setUsers() method.
  const handleAllChecked = e => {
    const { checked } = e.target;
    let newUsers = users.map(user => {
      if(currentItems.includes(user)) {
        return {...user, isChecked: checked};
      }
      return user;
    })
    setUsers(newUsers);
  };

  //  After the user has edited the user data, set the users to the state using the setUsers() method.
  const handleUserEditFormSubmit = e => {
    e.preventDefault();
    const editedUser = {
      id: editUserId,
      name: editUserForm.name,
      email: editUserForm.email,
      role: editUserForm.role
    };
    const newUser = [ ...users ];
    const index = newUser.findIndex(user => user.id === editUserId);
    newUser[index] = editedUser;
    setUsers(newUser);
    setEditUserId(null);
  };

  //  Return the list of users that match the search text entered by the user.
  const searchResultUser = user => {
    if(searchResult === '') {
      return user;
    }
    else if (user.name.toLowerCase().includes(searchResult.toLowerCase()) || user.email.toLowerCase().includes(searchResult.toLowerCase()) || user.role.toLowerCase().includes(searchResult.toLowerCase())) {
      return user;
    }
    return null;  //  Return null if the user does not match the search text.
  };
  
  const indexOfLastItem = currentPage * itemPerPage;  //  Calculate the index of the last item in the current page.
  const indexOfFirstItem = indexOfLastItem - itemPerPage; //  Calculate the index of the first item in the current page.
  const filteredUsers = users.filter((user) => searchResultUser(user));  //  Filter the users based on the search text entered by the user.
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);  //  Get the users in the current page.

  return (
    <>
    <div className="relative min-h-screen min-w-screen bg-background dark:bg-background-dark dark:text-white transition-all ease-out text-gray text-center flex justify-center items-center overflow-hidden">
      <div className="h-full sm:h-auto w-full sm:w-auto mt-0 sm:mt-4 px-2 sm:px-8 text-sm md:text-md">

        {
          error && <Modal />
        }

        <div className="py-1 pt-0 w-full flex justify-between items-center">
          <DeleteSelectedBtn users={users} setUsers={setUsers} />
          <div className="flex justify-center items-center">
            <SearchUser searchResult={searchResult} setSearchResult={setSearchResult} />
            {/* <ThemeToggle /> */}
          </div>
        </div>

        <div className="flex flex-col mt-1 min-h-[75vh] min-w-auto md:min-w-[75vw] xl:min-w-[55vw]"> 
            <div className="py-2 pb-0 overflow-auto"> 
                <form onSubmit={handleUserEditFormSubmit}>
                  <table className="w-full sm:min-w-full table-auto">
                    <thead className="relative">
                      <tr className="text-md font-medium text-gray-deep uppercase tracking-wider">
                        <th scope="col" className="px-6 py-2 w-auto text-center">
                          <input  
                          type="checkbox" 
                          value="checkedAll" 
                          className="form-checkbox h-4 w-4" 
                          onChange={handleAllChecked} 
                          checked={ users.slice(indexOfFirstItem, indexOfLastItem).filter( user => user?.isChecked !== true ).length < 1 }
                          />
                        </th> 
                        <th scope="col" className="px-6 py-2 text-left">Name</th>
                        <th scope="col" className="px-6 py-2 text-left">Email</th>
                        <th scope="col" className="px-6 py-2 text-left">Role</th>
                        <th scope="col" className="px-6 py-2 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="relative text-md divide-y-4 divide-transparent">
                      {
                        loading 
                        ? <Skeleton />
                        : users && users.length > 0 && filteredUsers.length > 0 
                          ? currentItems
                            .map((user, index) => (
                              <Fragment key={index}>
                                {
                                  editUserId === user.id 
                                  ? <EditableRow 
                                      key={index+20} 
                                      user={editUserForm}
                                      editUserForm={editUserForm}
                                      setEditUserForm={setEditUserForm}
                                      setEditUserId={setEditUserId}
                                    />
                                  : <DisplayRows 
                                      key={index+10} 
                                      user={user} 
                                      users={users}
                                      setUsers={setUsers}
                                      setEditUserId={setEditUserId}
                                      setEditUserForm={setEditUserForm}
                                    /> 
                                }
                              </Fragment>
                            ))
                          : <tr className="text-center w-full text-lg text-indigo-500">
                                <td colSpan={5} className="p-5">
                                  <div className="flex flex-col justify-center items-center">
                                    {/* <img src={icon} alt="Empty" /> */}
                                    <span className="p-2 text-lg font-semibold">No Users Found</span>
                                  </div>
                                </td>
                            </tr>
                      }
                    </tbody>
                  </table>
                </form>
            </div>
        </div>

        <div className={`${users.length !== 0 ? 'flex' : 'invisible' }  justify-center items-center py-2 md:py-6`}>
          <Pagination 
            filteredUsers={filteredUsers}
            itemPerPage={itemPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
        
      </div>
    </div>
    </>
  )
}


export default App;
