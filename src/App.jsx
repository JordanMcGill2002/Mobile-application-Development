import { useState, useRef, useEffect } from "react";
import Form from "./components/Form";
import FilterButton from "./components/FilterButton";
import Todo from "./components/Todo";
import { nanoid } from "nanoid";

function usePrevious(value) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const FILTER_MAP = {
  All: () => true,
  Active: (task) => !task.completed,
  Completed: (task) => task.completed,
};

const FILTER_NAMES = Object.keys(FILTER_MAP);

export default function App(props) {


  const geoFindMe = () => {
    if (!navigator.geolocation) {
      console.log("Geolocation is not supported by your browser");
    } else {
      console.log("Locating…");
      navigator.geolocation.getCurrentPosition(success, error);
    }
  };
  const success = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    console.log(latitude, longitude);
    console.log(`Latitude: ${latitude}°, Longitude: ${longitude}°`);
    console.log(`Try here: https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`);
    locateTask(lastInsertedId, {
      latitude: latitude,
      longitude: longitude,
      error: "",
    });
  };
  const error = () => {
    console.log("Unable to retrieve your location");
  };

  function usePersistantState(key, defaultValue) {
    const [state, setState] = useState(
      () => JSON.parse(localStorage.getItem(key)) || defaultValue,
    );

    useEffect(() => {
      localStorage.setItem(key, JSON.stringify(state));
    }, [key, state]);
    return [state, setState];
  }

  const [tasks, setTasks] = usePersistantState("tasks", []);
  // const [tasks, setTasks] = useState(props.tasks);
  const [filter, setFilter] = useState("All");
  const [lastInsertedId, setLastInsertedId] = useState("");

  function toggleTaskCompleted(id) {
    const updatedTasks = tasks.map(task => {
      // if this task has the id of the edited task
      if (id === task.id) {
        // use object spread to make a new object
        // whose `completed` prop has been inverted
        const updatedTask = { ...task, completed: !task.completed };
        if (!task.completed) {
          const now = new Date();
          const year = now.getFullYear();
          const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed in JavaScript
          const day = String(now.getDate()).padStart(2, '0');
          const hours = String(now.getHours()).padStart(2, '0');
          const minutes = String(now.getMinutes()).padStart(2, '0');
          updatedTask.completionDate = `${year}-${month}-${day} ${hours}:${minutes}`;
        }
        return updatedTask;
      }
      return task;
    });
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks)); // Store the updated tasks in the local storage
  }

  function deleteTask(id) {
    const remainingTasks = tasks.filter((task) => id !== task.id);
    setTasks(remainingTasks);
  }

  function editTask(id, newName, newDueDate, newShrtDesc, completionDate) { // Add completionDate as a parameter
    const editedTaskList = tasks.map((task) => {
      // if this task has the same ID as the edited task
      if (id === task.id) {
        // Copy the task and update its name, due date, description, and completion date
        return { ...task, name: newName, dueDate: newDueDate, shrtDesc: newShrtDesc, completionDate: completionDate };
      }
      // Return the original task if it's not the edited task
      return task;
    });
    setTasks(editedTaskList);
}

  function locateTask(id, location) {
    console.log("locate Task", id, " before");
    console.log(location, tasks);
    const locatedTaskList = tasks.map((task) => {
      // if this task has the same ID as the edited task
      if (id === task.id) {
        //
        return { ...task, location: location };
      }
      return task;
    });
    console.log(locatedTaskList);
    setTasks(locatedTaskList);
  }

  function photoedTask(id) {
    console.log("photoedTask", id);
    const photoedTaskList = tasks.map((task) => {


      if (id === task.id) {

        return { ...task, photo: true };
      }
      return task;
    });
    console.log(photoedTaskList);
    setTasks(photoedTaskList); // 2 à Update your tasks list appending the task with photo.
  }

  const taskList = tasks
    ?.filter(FILTER_MAP[filter])
    .map((task) => (
      <Todo //Call everything into this functiuon which is to be displayed.
        id={task.id}
        name={task.name}
        completed={task.completed}
        dueDate={task.dueDate}
        shrtDesc={task.shrtDesc}
        completionDate={task.completionDate}
        key={task.id}
        location={location}
        photoedTask={photoedTask}
        toggleTaskCompleted={toggleTaskCompleted}
        deleteTask={deleteTask}
        editTask={editTask}
      />

    ));

  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ));


  function addTask(name, dueDate, shrtDesc) {
    const id = "todo-" + nanoid();
    const newTask = {
      id: id,
      name: name,
      dueDate: dueDate,
      shrtDesc: shrtDesc,
      completed: false,
      location: { latitude: "##", longitude: "##", error: "##" },
    };
    setLastInsertedId(id);
    setTasks([...tasks, newTask]);
  }


  const tasksNoun = taskList.length !== 1 ? "Tasks" : "task";
  const headingText = `${taskList.length} ${tasksNoun} Remaining!`;

  const listHeadingRef = useRef(null);
  const prevTaskLength = usePrevious(tasks.length);

  useEffect(() => {
    if (tasks.length < prevTaskLength) {
      listHeadingRef.current.focus();
    }
  }, [tasks.length, prevTaskLength]);

  return (
    <div className="todoapp stack-large">
      <h1>Task List!</h1>
      <Form addTask={addTask} geoFindMe={geoFindMe} />{" "}
      <div className="filters btn-group stack-exception">{filterList}</div>
      <h2 id="list-heading" tabIndex="-1" ref={listHeadingRef}>
        {headingText}
        <br />
        <br />
      </h2>
      <ul
        aria-labelledby="list-heading"
        className="todo-list stack-large stack-exception"
        role="list"
      >
        {taskList}
      </ul>
    </div>
  );
}
