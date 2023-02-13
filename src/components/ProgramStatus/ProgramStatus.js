import { useEffect, useState } from "react";
import globals from "../../globals";
const axios = require("axios").default;

const ProgramStatus = ({index, program}) => {
  const [check, setCheck] = useState(program.status === "process" ? false : true);
  console.log(check);

  const updateStudentProgramStatus = async() => { 
    const data = {
      studentId: program.student_id, 
      programId: program.program_id, 
      status: check === false ? "complieted" : "process"
    }; 

    console.log(data);

    console.log(data);
    await axios({
      method: "put",
      url: `${globals.productionServerDomain}/updateStudentProgramStatus`, 
      data: data,
    })
      .then(function (res) {
        alert("Данные успешно изменены"); 
      })
      .catch((err) => {
        alert("Произошла ошибка");
      });
  };

  const onChangeHandler = async () => {
    await setCheck(!check);
    await updateStudentProgramStatus();
  }


  return <div>
    <p>{program.title}</p>
    <label>
      <input type="checkbox" checked={check} onChange={onChangeHandler} /> 
      Ученик завершил обучение по программе
    </label>
  </div>
};

export default ProgramStatus;