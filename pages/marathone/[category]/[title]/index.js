import { useRouter } from "next/router";
import React, {useEffect, useState} from "react";
import AboutMarathone from "../../../../src/components/AboutMarathone/AboutMarathone";
import Footer from "../../../../src/components/Footer/Footer";
import HeaderMarathone from "../../../../src/components/HeaderMarathone/HeaderMarathone";
import globals from "../../../../src/globals";
import axios from "axios";
import WhatToExpect from "../../../../src/components/WhatToExpect/WhatToExpect";
import TrainingWithUs from "../../../../src/components/TrainingWithUs/TrainingWithUs";
import MarathoneAppBlock from "../../../../src/components/MarathoneAppBlock/MarathoneAppBlock";
import AboutMarathoneTeacher from "../../../../src/components/AboutMarathoneTeacher/AboutMarathoneTeacher";

function Marathone(props) {
  const router = useRouter();
  const [marathone, setMarathone] = useState();

  const getMarathoneDatas = async () => {
    let data = props.title
    const marathoneDatas = await axios.post(`${globals.productionServerDomain}/getMarathone/` + data)
    setMarathone(marathoneDatas.data[0]);
  };

   useEffect(() => {
    console.log(props);
    getMarathoneDatas();
    console.log(marathone);
  }, [])


  return (
    <>
      <div style={{backgroundColor: "#f1faff", width: "100vw"}}>
        <HeaderMarathone  white={true} />
        <AboutMarathone marathone={marathone} />
        <WhatToExpect />
        <TrainingWithUs />
        <AboutMarathoneTeacher />
        <MarathoneAppBlock marathone={marathone} />
        <Footer />
      </div>
    </>
  )
}

Marathone.getInitialProps = async (ctx) => {
  if(ctx.query.title !== undefined) {
      return {
        title: ctx.query.title,
        category: ctx.query.category
      }
  }else{
    return {};
  }
}

export default Marathone;
