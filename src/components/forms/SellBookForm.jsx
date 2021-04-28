import React, { useState, useEffect } from 'react';
import * as S from './SellBookFormStyle';
import { useStateValue } from './../../context/StateProvider';
import { db, storage } from '../../database';
import { actionTypes } from '../../context/reducer';
import { TramRounded } from '@material-ui/icons';

export const SellBookForm = () => {
  const [{ departments, user }, dispatch] = useStateValue();
  const [warning, setWarn] = useState(false);
  const [courses, setCourses] = useState([]);
  const [types, setType] = useState(false);
  const [selected, setSelected] = useState(0);
  const [inputs, setInput] = useState({
    title: '',
    author: '',
    isbn: 0,
    edition: '',
    publisher: '',
    department: '',
    courseUsedIn: '',
    type: 'sell',
    price: 0,
    bookImg: '',
    bookPostedById: '',
  });

  const title = inputs.title;
  const author = inputs.author;
  const isbn = inputs.ispn;
  const edition = inputs.edition;
  const publisher = inputs.publisher;
  const type = inputs.type;
  const price = inputs.price;
  const bookImg = inputs.bookImg;

  useEffect(() => {
    console.log('useEffect ran on sell / trade page');
    getDepartments();
    console.log(user);
  }, []);

  async function getDepartments() {
    const response = db.collection('University');
    const data = await response.get();
    const depts = [];
    data.docs.forEach((dept) => {
      depts.push(dept.data());
    });
    console.log('just fetched data from FireBase');
    addDepartmentsToDataLayer(depts);
    setCourses(depts[0].courses);
    setInput((prevState) => {
      return {
        ...prevState,
        department: depts[0].department_name,
        courseUsedIn: depts[0].courses[0],
      };
    });
  }

  function addDepartmentsToDataLayer(depts) {
    dispatch({
      type: actionTypes.SET_DEPARTMENTS,
      departments: [...depts],
    });
  }

  const changeTitle = (e) => {
    setInput((prevState) => {
      return { ...prevState, title: e.target.value };
    });
  };

  const changeAuthor = (e) => {
    setInput((prevState) => {
      return { ...prevState, author: e.target.value };
    });
  };
  const changeISBN = (e) => {
    setInput((prevState) => {
      return { ...prevState, isbn: e.target.value };
    });
  };

  const changeEdition = (e) => {
    setInput((prevState) => {
      return { ...prevState, edition: e.target.value };
    });
  };
  const changePublisher = (e) => {
    setInput((prevState) => {
      return { ...prevState, publisher: e.target.value };
    });
  };
  const changeDepartment = (e) => {
    const courses = departments.find(
      (dept) => dept.department_name === e.target.value
    );
    setSelected(e.target.options.selectedIndex);
    setCourses(courses.courses);
    setInput((prevState) => {
      return {
        ...prevState,
        department: e.target.value,
        courseUsedIn: courses.courses[0],
      };
    });
  };
  const changeCourseUsedIn = (e) => {
    console.log(e.target.value);
    setInput((prevState) => {
      return { ...prevState, courseUsedIn: e.target.value };
    });
  };

  const changeType = (e) => {
    setInput((prevState) => {
      return { ...prevState, type: e.target.value };
    });
    if (e.target.value === 'trade') {
      document.getElementById('price').disabled = true;
    } else {
      document.getElementById('price').disabled = false;
      setType(true);
    }
  };

  const changePrice = (e) => {
    setInput((prevState) => {
      return { ...prevState, price: e.target.value };
    });
  };

  const onFilechange = async (e) => {
    const file = e.target.files[0];
    const storageRef = storage.ref();
    const fileRef = storageRef.child(file.name);
    await fileRef.put(file);
    const fileUrl = await fileRef.getDownloadURL();
    setInput((prevState) => {
      return { ...prevState, bookImg: fileUrl };
    });
  };

  //write function here
  function sellPageDB() {
    db.collection('Post')
      .add({ ...inputs })
      .then(console.log('added to the database'))
      .catch(function (err) {
        console.log(err);
      });
    db.collection('Books')
      .add({ ...inputs })
      .then(console.log('added to books collection database'))
      .catch(function (err) {
        console.log(err);
      });
  }

  //call db function inside onSubmit
  const onSubmit = (e) => {
    e.preventDefault();
    const image = document.getElementById('picture').value;
    console.log(image);

    if (
      title &&
      author &&
      isbn &&
      edition &&
      publisher &&
      bookImg &&
      (price >= 0 || types === 'trade')
    ) {
      setInput((prevState) => {
        return { ...prevState, bookPostedById: user.uid };
      });
      console.log('filled out');
      console.log(inputs);
      return sellPageDB();
    }
    console.log('failed');

    if (price < 0) {
      document.getElementById('warning').innerHTML =
        'A Book Must Cost A Positive Price';
    }

    if (price > 0) {
      document.getElementById('warning').innerHTML =
        'Make Sure All Fields Are Filled Out and In Correct Format';
    }
    setWarn((prewarn) => (prewarn = !prewarn));

    setTimeout(() => {
      setWarn((prewarn) => (prewarn = !prewarn));
    }, 4000);
  };

  return (
    <S.Container>
      {warning === true ? (
        <S.WarningDiv id="warning">
          Make Sure All Fields Are Filled Out and In Correct Format
        </S.WarningDiv>
      ) : (
        <S.WarningDiv id="warning" style={{ opacity: 0 }}>
          Make Sure All Fields Are Filled Out and In Correct Format
        </S.WarningDiv>
      )}
      <S.Header id="form-container">Post a Book for Sale or Trade</S.Header>
      <S.Form method="POST" onSubmit={(e) => onSubmit(e)}>
        <S.Label HTMLFor="title">Book Title</S.Label>
        <S.Input
          type="text"
          id="title"
          name="title"
          value={title}
          onChange={changeTitle}
          placeholder="Intro to Algorithms"
        ></S.Input>
        <S.Label HTMLFor="author">Author</S.Label>
        <S.Input
          type="text"
          id="author"
          name="author"
          value={author}
          onChange={changeAuthor}
          placeholder="Thomas Cormen"
        ></S.Input>
        <S.Label HTMLFor="isbn">ISBN</S.Label>
        <S.Input
          type="number"
          id="isbn"
          name="isbn"
          value={isbn}
          onChange={changeISBN}
          placeholder="9780140274059"
        ></S.Input>
        <S.Label HTMLFor="edition">Edition</S.Label>
        <S.Input
          type="text"
          id="edition"
          name="edition"
          value={edition}
          onChange={changeEdition}
          placeholder="3"
        ></S.Input>
        <S.Label HTMLFor="publisher">Publisher</S.Label>
        <S.Input
          type="text"
          id="publisher"
          name="publisher"
          value={publisher}
          onChange={changePublisher}
          placeholder="MIT Press"
        ></S.Input>

        <S.Label>Department</S.Label>
        <S.Select id="department" onChange={changeDepartment}>
          {departments.map((dept, i) => {
            if (i === selected) {
              return (
                <S.Option
                  key={Math.floor(Math.random() * 10000) + 1}
                  value={dept.department_name}
                  selected
                >
                  {dept.department_name}
                </S.Option>
              );
            } else {
              return (
                <S.Option
                  key={Math.floor(Math.random() * 10000) + 1}
                  value={dept.department_name}
                >
                  {dept.department_name}
                </S.Option>
              );
            }
          })}
        </S.Select>

        <S.Label>Course Used In</S.Label>
        <S.Select id="course" onChange={changeCourseUsedIn}>
          {courses.map((course) => {
            return (
              <S.Option
                key={Math.floor(Math.random() * 10000) + 1}
                value={course}
              >
                {course}
              </S.Option>
            );
          })}
        </S.Select>

        <S.SaleOrTradeContainer>
          <S.Label>Sell or Trade</S.Label>
          <S.RadioButtonContainer>
            <S.RadioButton
              type="radio"
              name="type"
              value="sell"
              className="type"
              onChange={changeType}
              defaultChecked
            ></S.RadioButton>
            <S.RadioLabel HMLTFor="type">Sell</S.RadioLabel>
            <S.RadioButton
              type="radio"
              name="type"
              value="trade"
              className="type"
              onChange={changeType}
            ></S.RadioButton>
            <S.RadioLabel HMLTFor="type">Trade</S.RadioLabel>
          </S.RadioButtonContainer>
          <S.Label HTMLFor="price">Price</S.Label>
          <S.Input
            type="number"
            id="price"
            name="price"
            value={price}
            onChange={changePrice}
          ></S.Input>
        </S.SaleOrTradeContainer>
        <S.Label HTMLFor="book-img">Choose Image of Book</S.Label>
        <S.InputFile
          type="file"
          accept="image/png, image/jpeg"
          id="picture"
          onChange={onFilechange}
        ></S.InputFile>
        <S.PostButton type="submit">Post Book</S.PostButton>
      </S.Form>
    </S.Container>
  );
};
