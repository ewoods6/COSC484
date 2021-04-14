import React, { useState } from 'react';
import { db } from '../../database/firebaseConfig';
import * as S from './SellBookFormStyle';

export const SellBookForm = () => {
  const [warning, setWarn] = useState(false);
  const [inputs, setInput] = useState({
    title: '',
    author: '',
    ispn: '',
    edition: '',
    publisher: '',
    department: '',
    courseUsedIn: '',
    sell: false,
    trade: false,
    post_description: ''
  });
  const title = inputs.title;
  const author = inputs.author;
  const ispn = inputs.ispn;
  const edition = inputs.edition;
  const publisher = inputs.publisher;
  const department = inputs.department;
  const courseUsedIn = inputs.courseUsedIn;
  const sell = inputs.type_sell;
  const trade = inputs.type_trade;
  const post_description = inputs.post_description;

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
  const changeISPN = (e) => {
    setInput((prevState) => {
      return { ...prevState, ispn: e.target.value };
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
    setInput((prevState) => {
      return { ...prevState, department: e.target.value };
    });
  };
  const changeCourseUsedIn = (e) => {
    setInput((prevState) => {
      return { ...prevState, courseUsedIn: e.target.value };
    });
  };
  const changeSell= (e) => {
    setInput((prevState) => {
      return { ...prevState, sell: !sell};
    });
  };

  const changeTrade= (e) => {
    setInput((prevState) => {
      return { ...prevState, trade: !trade };
    });
  };

  const changeDescription= (e) => {
    console.log(e.target.value);
    setInput((prevState) => {
      return { ...prevState, description: e.target.value };
    });
  };

  //write function here
  function sellPageDB(){
    db.collection("Post").add({...inputs})
    .then(console.log("added to the database"))
    .catch(function (err)
    {console.log(err)});
  }

  //call db function inside onSubmit
  const onSubmit = (e) => {
    e.preventDefault();

    if (
      title &&
      author &&
      ispn &&
      edition &&
      publisher &&
      department &&
      courseUsedIn
    ) {
      console.log('filled out');
      return sellPageDB();
    }
    console.log('failed');

    setWarn((prewarn) => (prewarn = !prewarn));

    setTimeout(() => {
      setWarn((prewarn) => (prewarn = !prewarn));
    }, 4000);
  };


  return (
    <S.Container>
      {warning === true ? (
        <S.WarningDiv>
          Make Sure All Fields Are Filled Out and In Correct Format
        </S.WarningDiv>
      ) : (
        <S.WarningDiv style={{ opacity: 0 }}>
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
        <S.Label HTMLFor="ispn">ISPN</S.Label>
        <S.Input
          type="number"
          id="ispn"
          name="ispn"
          value={ispn}
          onChange={changeISPN}
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
        <S.Label HTMLFor="department">Department</S.Label>
        <S.Input
          type="text"
          id="department"
          name="department"
          value={department}
          onChange={changeDepartment}
          placeholder="Computer"
        ></S.Input>
        <S.Label HTMLFor="courseUsedIn">Course Used In</S.Label>
        <S.Input
          type="text"
          id="courseUsedIn"
          name="courseused"
          value={courseUsedIn}
          onChange={changeCourseUsedIn}
          placeholder="COSC 336"
        ></S.Input>        
        <input
        type="textarea"
        id="post_description"
        name="post_description"
        value={post_description}
        onChange={changeDescription}
        placeholder="Write your description here"
        />
        <S.SaleOrTradeContainer>
          <S.Label>Sell or Trade</S.Label>
          <S.RadioButtonContainer>
            <S.RadioButton
              type="radio"
              name="type"
              value="sell"
              id="type_sell"
              onChange={changeSell}
            ></S.RadioButton>
            <S.RadioLabel HMLTFor="type">Sell</S.RadioLabel>
            <S.RadioButton
              type="radio"
              name="type"
              value="trade"
              id="type_trade"
              onChange={changeTrade}
            ></S.RadioButton>
            <S.RadioLabel HMLTFor="type">Trade</S.RadioLabel>
          </S.RadioButtonContainer>
        </S.SaleOrTradeContainer>
        <S.Label HTMLFor="book-img">Choose Image of Book</S.Label>
        <S.InputFile type="file" accept="image/png, image/jpeg"></S.InputFile>
        <S.PostButton type="submit">Post Book</S.PostButton>
      </S.Form>
    </S.Container>
  );
};
