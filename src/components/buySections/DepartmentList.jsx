import React from 'react';
import * as S from './DepartmentListStyle';
import { Department } from './department/Department';
import { db } from '../../database/firebaseConfig';

export const DepartmentList = ({ depInfo, clickedDept }) => {

  //need to get all of the departments in Firebase
  //display them onscreen as buttons

  //gets one department from the University collection
  var docRef = db.collection("University").doc("art_department");

  docRef.get().then((doc) => {
    if (doc.exists) {
        console.log("Document data (from Firebase):", doc.data());
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
  }).catch((error) => {
    console.log("Error getting document:", error); 
  });
  

  //testing - gets all documents in a collection from Firebase
  async function testing(){
  const uniRef = db.collection('University');
  const snapshot = await uniRef.get();
  snapshot.forEach(doc => {
    console.log(doc.id, '=>', doc.data());
  });
}
  testing();

  return (
    <S.Container>
      {depInfo.map((dep) => (
        <Department key={dep.id} depInfo={dep} clickedDept={clickedDept} />
      ))}
    </S.Container>
  );
};
