import React, { useState, useEffect } from 'react';
import styles from "./Pagination.module.css";
import classnames from 'classnames';

function Pagination({ pages = 10, setCurrentPage, more, setMore }) {
  const numberOfPages = [];
  for (let i = 1; i <= pages; i++) {
    numberOfPages.push(i);
  };

  const [currentButton, setCurrentButton] = useState(1);

  const [arrOfCurrButtons, setArrOfCurrButtons] = useState([]);

  useEffect(() => {
    let tempNumberOfPages = [...arrOfCurrButtons];

    let dotsInitial = '...';
    let dotsLeft = '...';
    let dotsRight = ' ...';

    if (numberOfPages.length < 6) {
      tempNumberOfPages = numberOfPages;
    } else if (currentButton >= 1 && currentButton <= 3) {
      tempNumberOfPages = [1, 2, 3, 4, dotsInitial, numberOfPages.length];
    } else if (currentButton === 4) {
      const sliced = numberOfPages.slice(0, 5);
      tempNumberOfPages = [...sliced, dotsInitial, numberOfPages.length];
    } else if (currentButton > 4 && currentButton < numberOfPages.length - 2) {
      const sliced1 = numberOfPages.slice(currentButton - 2, currentButton);
      const sliced2 = numberOfPages.slice(currentButton, currentButton + 1);
      tempNumberOfPages = ([1, dotsLeft, ...sliced1, ...sliced2, dotsRight, numberOfPages.length]);
    } else if (currentButton > numberOfPages.length - 3) {
      const sliced = numberOfPages.slice(numberOfPages.length - 4);
      tempNumberOfPages = ([1, dotsLeft, ...sliced]);         
    } else if (currentButton === dotsInitial) {
      setCurrentButton(arrOfCurrButtons[arrOfCurrButtons.length-3] + 1);
    } else if (currentButton === dotsRight) {
      setCurrentButton(arrOfCurrButtons[3] + 2);
    } else if (currentButton === dotsLeft) {
      setCurrentButton(arrOfCurrButtons[3] - 2);
    };

    setArrOfCurrButtons(tempNumberOfPages);
    setCurrentPage(currentButton);
  }, [currentButton]);

  // console.log(numberOfPages, currentButton);

  return (
    <div className={styles.pagination_container}>
      <div>
        Страница {currentButton} из {numberOfPages.length}
      </div>
      <div className={styles.btns}>
        <a
          href="#students"
          className={classnames(currentButton === 1 
            ? styles.disabled 
            : '', 
            styles.prev_btn
          )}
          onClick={() => {
            window.scrollBy(0, 1200)
            setCurrentButton(prev => prev <= 1 ? prev : prev - 1)
          }}
        ></a>
        <a
          href="#students"
          className={!more ? styles.top_btn : styles.btm_btn}
          onClick={() => {
            window.scrollBy(0, 1200)
            setMore(!more)
          }}
        ></a>
        <a
          href="#students"
          className={classnames(currentButton === numberOfPages.length 
            ? styles.disabled 
            : '', 
            styles.next_btn
          )}
          onClick={() => {
            setCurrentButton(prev => prev >= numberOfPages.length ? prev : prev + 1);
          }}
        ></a>
      </div>
      {/* <a
        href="#"
        className={classnames(currentButton === 1 
          ? styles.disabled 
          : '', 
          styles.prev_btn
        )}
        onClick={() => {
          window.scrollBy(0, 1200)
          setCurrentButton(prev => prev <= 1 ? prev : prev - 1)
        }}
      ></a> */}
      {/* {arrOfCurrButtons.map(((item, index) => {
        return <a
          href="#"
          key={index}
          className={ currentButton === item 
            ? styles.active 
            : ''
          }
          onClick={() => {
            setCurrentButton(item);
          }}
        >
          {item}
        </a>
      }))} */}
      {/* <a
        href="#"
        className={classnames(currentButton === numberOfPages.length 
          ? styles.disabled 
          : '', 
          styles.next_btn
        )}
        onClick={() => {
          setCurrentButton(prev => prev >= numberOfPages.length ? prev : prev + 1);
        }}
      ></a> */}
    </div>
  );
};


export default Pagination;
