import { useState, useEffect } from "react";

function Form(props) {
  const [name, setName] = useState('');
  const [dueDate, setDueDate] = useState(''); // Add a new state variable for the due date
  const [shrtDesc, setShrtDesc] = useState('');
  const [addition, setAddition] = useState(false);
  useEffect(() => {
    if (addition) {
      console.log("useEffect detected addition");
      props.geoFindMe();
      setAddition(false);
    }
  });

  function handleSubmit(event) {
    event.preventDefault();
    setAddition(true);
    // Check if name is not empty
    if (name.trim() !== "") {

      props.addTask(name, dueDate, shrtDesc); // Pass the due date to the addTask function

      setName("");
      setDueDate("");
      setShrtDesc("");
    } else {
      alert("Name field cannot be empty");
    }
  }



  function handleDateChange(event) {
    setDueDate(event.target.value); // Update the due date state when the input changes
  }


  // In the form
  <input
    type="date"
    id="new-todo-due-date"
    className="input input__lg"
    name="dueDate"
    value={dueDate}
    onChange={handleDateChange}
  />

  function handleChange(event) {
    setName(event.target.value);
  }
  function handleShrtDescChange(event) {
    setShrtDesc(event.target.value);
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="label-wrapper">
        <label htmlFor="new-todo-input" className="label__lg">
          What task will be added?
        </label>
      </h2>

      <input
        type="text"
        id="new-todo-input"
        className="input input__lg"
        name="text"
        autoComplete="off"
        value={name}
        onChange={handleChange}
      />

<label htmlFor="new-todo-desc" className="label__lg">
        Description - Give a Short Desc of the Task!
      </label>
      <input
        type="text"
        id="new-todo-desc"
        className="input input__lg"
        name="Dest"
        value={shrtDesc}
        onChange={handleShrtDescChange}
      />

      <label htmlFor="new-todo-due-date" className="label__lg">
        When should the task be completed by?
      </label>
      <input
        type="date"
        id="new-todo-due-date"
        className="input input__lg"
        name="dueDate"
        value={dueDate}
        onChange={handleDateChange}
      />




      <button type="submit" className="btn btn__primary btn__lg">
        Add
      </button>
    </form>
  );
}

export default Form;
