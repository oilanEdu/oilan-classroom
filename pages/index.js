import ApplicationBlock from "../src/components/ApplicationBlock/ApplicationBlock";
import CoursePrice from "../src/components/CoursePrice/CoursePrice";
import Footer from "../src/components/Footer/Footer";
import Program from "../src/components/Program/Program";

const Main = (props) => {

  return (
    <div>
      <Program />
      <CoursePrice />
      <ApplicationBlock />
      <Footer />
    </div>
  )
}

export default Main;

