// JavaScript Document
<!--
function reload() {
  var puzzle = "";
  
  if (document.form1.puzzle[0].checked == true){
    puzzle = "200000007600000002007304801002407900000201000004508200006705400300000006400000008";
  } else if (document.form1.puzzle[1].checked == true){
    puzzle = "000105000140000670080002400063070010900000003010090520007200080026000035000409000";
  } else if (document.form1.puzzle[2].checked == true){
    puzzle = "041050807200086050068000093870502000000600900050001028406000580080920004900064702";  
  } else if (document.form1.puzzle[3].checked == true){
    puzzle = "020090000003100000074065100300004600702000308540000090000040820000500704000726000";
  }
  
  
  var c = 0;
  for (var x = 1; x < 10; x++) {
    for (var y = 1; y < 10; y++) {
      if (puzzle.charAt(c) == "0") {
        document.getElementById(x + "" + y).value = "";
      } else {
        document.getElementById(x + "" + y).value = puzzle.charAt(c);      
      } 
      document.getElementById("h" + x + "" + y).value = "";
      c = c + 1;
    }
  }

}

function clearit() {
  for (var x = 1; x < 10; x++) {
    for (var y = 1; y < 10; y++) {
      document.getElementById(x + "" + y).value = "";
      document.getElementById("h" + x + "" + y).value = "";
    }
  }
}

// need to have a possible values hidden input field to progress as we need to keep track of those
function begin() {
  // first inspect each square and check if there is only one possible value
  var cont = true;  //set to true if we find anything and we can loop and do it again
  
  for(var i = 0; cont; i--){
    if (ruleItOut(1,1)) {
      cont = true;
    } else if (possibleVals(1,1)) {
      cont = true;
    } else if (vertPossVals(1,1)) {
      cont = true;
    } else if (horizPossVals(1,1)) {
      cont = true;      
//    } else if (nPairsTriples(1,1)) {
//      cont = true;          
    } else {
      cont = false;
    }
  }
    
  return false;
  
}

function ruleItOut(x, y) {
  var possNums;
  var cont = false;
  var currentVal;
  var remove = "";
  
  for (var x=1; x<10; x++) {
    for (var y=1; y<10; y++) {
      if (document.getElementById("h" + x + "" + y).value == "") {
        possNums = "123456789";
      } else {
        possNums = document.getElementById("h" + x + "" + y).value;
      }
      

      if (document.getElementById(x + "" + y).value == "") { 
        
        possNums = checkHoriz(possNums, x);
        possNums = checkVertical(possNums, y);
        possNums = checkSquare(possNums, x, y); 

        document.getElementById("h" + x + "" + y).value = possNums;               
        currentVal = document.getElementById("h" + x + "" + y).value;
        if (currentVal.length == 0) {
          // alert("1st time - ruleitout putting hidden " + possNums + " in " + x + "" + y);
          document.getElementById("h" + x + "" + y).value = possNums;               
        } else {
                
          // if there is anything in hidden fields that is not in possNums take it out
          for (var i = 0; i < currentVal.length; i++) {
            t = currentVal.substring(i, i+1);
            if (possNums.indexOf(t) < 0) {
              remove += "" + t;
            }
          }
          
          for  (var k = 0; k < remove.length; k++) {
            t = remove.substring(k, k + 1);
            currentVal = currentVal.substring(0, currentVal.indexOf(t)) + currentVal.substring(currentVal.indexOf(t) + 1, 9);
            document.getElementById("h" + x + "" + y).value = currentVal;
            alert("2nd time - ruleitout putting hidden " + currentVal + " in " + x + "" + y);
          }

        }

        if (document.getElementById("h" + x + "" + y).value.length == 1) {
          //alert("ruleitout putting " + possNums + " in " + x + "" + y);
          document.getElementById(x + "" + y).value = document.getElementById("h" + x + "" + y).value;
          document.getElementById("h" + x + "" + y).value = "";
          cont = true;
        } 

      } 
        
    } 
  }
  return cont;
}

function possibleVals( x, y) {
  var possVals;
  var numPossVals = "";
  var cont = false;
  var numTimesCVFound;
  var currentVal = "";
  var foundOne;
  var currentSquare = "1";

  //loop through each 3x3 square
  for (var i=1; i<10; i++) {
    //minus which values cannot be in that square
    possVals = checkSquare("123456789", x, y);           
    numPossVals = possVals.length;
    
    // loop through the possible Values 
    for (var k = 0; k < numPossVals; k++ ) {

      //minus which values cannot be in that square
      possVals = checkSquare("123456789", x, y);           
      possVals = possVals.substring(k, 9);
      //take the first value and find a box it could go in, take the second number next loop
      currentVal = possVals.substring(0,1);
      numTimesCVFound = 0;
      
      // inspect each element in the current square  
      for (var j=1; j<10; j++) {
      
        // move accross and up if needed  
        if ( j == 4 ||  j == 7) {
          x = x - 3;
          y++;
        } 

        // need to make sure there is nothing alredy in the box
        if (document.getElementById(x + "" + y).value == "") { 
          
          if (possVals.indexOf(currentVal) < 0) {
            possVals = currentVal + "" + possVals; 
          }
          possVals = checkHoriz(possVals, x);
          possVals = checkVertical(possVals, y);
          possVals = checkSquare(possVals, x, y); 
          if (possVals.indexOf(currentVal) > -1) {
            numTimesCVFound++;
            foundOne = x + "" + y;
          } 
          if  (numTimesCVFound > 1) {
            // found this value too many times, move on to the next
            break;;
          }
           
        }
        
        // if it's the last time through and only one possible square has been found for currentVal put it in
        if (j == 9 && numTimesCVFound == 1) {
          //alert("possibleVals putting " + currentVal + " in " + foundOne);  
          document.getElementById(foundOne).value = currentVal;
          document.getElementById("h" + foundOne).value = "";
          cont = true;
        }        
        x++;          
      }       
      // break comes to here... we know the first value of possVals does not work and we need to move onto the next
      // need to reset the x and y value and update the current square if necessary
      if (k == (numPossVals - 1)) {
        currentSquare++;
      }
      if (currentSquare == 1) {
        x = 1;
        y = 1;      
      } else if (currentSquare == 2) {
        x = 4;
        y = 1;            
      } else if (currentSquare == 3) {
        x = 7;
        y = 1;      
      } else if (currentSquare == 4) {
        x = 1;
        y = 4;            
      } else if (currentSquare == 5) {
        x = 4;
        y = 4;            
      } else if (currentSquare == 6) {
        x = 7;
        y = 4;            
      } else if (currentSquare == 7) {
        x = 1;
        y = 7;            
      } else if (currentSquare == 8) {
        x = 4;
        y = 7;            
      } else if (currentSquare == 9) {
        x = 7;
        y = 7;                        
      }
    }
  }
  
  return cont;
}

function vertPossVals(x, y) {
  var possVals = "123456789";
  var currentVal;
  var numTimesCVFound = 0;
  var numPossVals;
  var foundOne;
  var cont = false;

  // loop through each vertical row
  for (var k=1; k<10; k++) {
      
    possVals = checkVertical("123456789", y);
    numPossVals = possVals.length;
    // loop through the possible values 
    for (var i=0; i<numPossVals; i++) {
    
      possVals = checkVertical("123456789", y);
      possVals = possVals.substring(i, 9);
      //take the first value and find a box it could go in, take the second number next loop
      currentVal = possVals.substring(0,1);
      
      // for each possible value in that column show me how many places it can go      
      for (var l=1; l<10; l++) {
        if (document.getElementById(x + "" + y).value == "") { 
          if ((possVals.indexOf(currentVal)) < 0) {
            possVals = currentVal + "" + possVals; 
          }
          
          possVals = checkHoriz(possVals, x);
          possVals = checkSquare(possVals, x, y); 
    
          if (possVals.indexOf(currentVal) > -1) {
            numTimesCVFound++;
            foundOne = x + "" + y;
          }
          if  (numTimesCVFound > 1) {
            // found this value too many times, move on to the next
            break;;
          }           
        }
        if (l == 9 && numTimesCVFound == 1) {
          // found one that can only go in that square - stick it in
          //alert("VerticalPossVals putting " + currentVal + " in " + foundOne);  
          cont = true;
          document.getElementById(foundOne).value = currentVal;
          document.getElementById("h" + foundOne).value = "";        
        }
        
        x++;
      }
      // reset x back to 1 and change numTimesCVFound back to none
      numTimesCVFound = 0;
      x = 1;
    }    
  y++;
  }
  
  return cont;
}    

function horizPossVals(x, y) {
  var possVals = "123456789";
  var currentVal;
  var numTimesCVFound = 0;
  var numPossVals;
  var foundOne;
  var cont = false;
  
  // loop through each horizontal column
  for (var k=1; k<10; k++) {
    possVals = checkHoriz("123456789", x);
    numPossVals = possVals.length;
    // loop through the possible values 
    for (var i=0; i<numPossVals; i++) {
    
      possVals = checkHoriz("123456789", x);
      possVals = possVals.substring(i, 9);
      //take the first value and find a box it could go in, take the second number next loop
      currentVal = possVals.substring(0,1);
      
      // for each possible value in that column show me how many places it can go      
      for (var l=1; l<10; l++) {
        if (document.getElementById(x + "" + y).value == "") { 
          if ((possVals.indexOf(currentVal)) < 0) {
            possVals = currentVal + "" + possVals; 
          }
          
          possVals = checkVertical(possVals, y);          
          possVals = checkSquare(possVals, x, y); 
    
          if (possVals.indexOf(currentVal) > -1) {
            numTimesCVFound++;
            foundOne = x + "" + y;
          }
          if  (numTimesCVFound > 1) {
            // found this value too many times, move on to the next
            break;;
          }           
        }
        if (l == 9 && numTimesCVFound == 1) {
          //found one that can only go in that square - stick it in
          //alert("horizPossVals putting " + currentVal + " in " + foundOne);
          cont = true;              
          document.getElementById(foundOne).value = currentVal;
          document.getElementById("h" + foundOne).value = "";        
        }
        
        y++;
      }
      // reset x back to 1 and change numTimesCVFound back to none
      numTimesCVFound = 0;
      y = 1;
    }    
  x++;
  }
  
  return cont;
}

// should be able to turn these 3 methods into one method, this was just easier to write at the time
function checkHoriz(possNums, xx){
  var temp = 0;

  for (var y=1; y<10; y++) {
    var t = document.getElementById(xx + "" + y).value;
    if (t != "" && possNums.indexOf(t) > -1) { 
      temp = possNums.substring(possNums.indexOf(t)-9,possNums.indexOf(t));
      temp = temp + possNums.substring(possNums.indexOf(t)+1,9);
      possNums = temp;
    }
  }
  return possNums;
}


function checkVertical(possNums, yy){
  var temp = 0;

  for (var x=1; x<10; x++) {
    var t = document.getElementById(x + "" +yy).value;
    if (t != "" && possNums.indexOf(t) > -1) { 
      temp = possNums.substring(possNums.indexOf(t)-9,possNums.indexOf(t));
      temp = temp + possNums.substring(possNums.indexOf(t)+1,9);
      possNums = temp;
    }
  }
  return possNums;
}


function checkSquare(possNums, xx, yy){
  var x,y;
  var temp = 0;
  
  // sorting out which square to loop from
  if (xx < 4) {
    x = 1;
  } else if (xx < 7) {
    x = 4;
  } else {
    x = 7;
  }

  if (yy < 4) {
    y = 1;
  } else if (yy < 7) {
    y = 4;
  } else {
    y = 7;
  }
  // end
  
  for (var i=1; i<4; i++) {
    for (var j=1; j<4; j++) { // TODO:: Check if + "" + is needed on all browsers
      var t = document.getElementById(x + "" + y).value;
      if (t != "" && possNums.indexOf(t) > -1) { 
        temp = possNums.substring(possNums.indexOf(t)-9,possNums.indexOf(t));
        temp = temp + possNums.substring(possNums.indexOf(t)+1,9);
        possNums = temp;
      }
      x++;
    }
    y++;
    x = x - 3;
  }
  
  return possNums;
}

/*
function nPairsTriples(x, y) {
  var cont;
  cont = false;

  // loop through each square
  for (var i = 1; i < 10; i++) {
    for (var j = 1; j < 10; j++) {
      // check if the cell is empty first and if it has a maximum of three possibilities
      if (document.getElementById("h" + x + "" + y).value.length < 4 && document.getElementById("h" + x + "" + y).value.length > 0) {
        // found one with only two or three possibilities - so need to find another with only two or three poss in the same column row or box
        if (nCheckSquare(document.getElementById("h" + x + "" + y).value, x, y, false)) {
          // at this point need to find where else document.getElementById("h" + x + "" + y).value occurs as a possibility and remove it if it contains anything else
          if (nCheckSquare(document.getElementById("h" + x + "" + y).value, x, y, true)) {
            cont = true;
          }
        }
        if (nCheckVertical(document.getElementById("h" + x + "" + y).value, y, false)) {
          if (nCheckVertical(document.getElementById("h" + x + "" + y).value, y, true)) {
            cont = true;
          }
        } 
        if  (nCheckHoriz(document.getElementById("h" + x + "" + y).value, x, false)) {
          if (nCheckHoriz(document.getElementById("h" + x + "" + y).value, x, true)) {
            cont = true;
          }
        }
      }
      x++;
      if (x == 4 || x == 7 || x == 10){
        y++;
        x = x - 3;
      }
    }
    
    numFound = 0;
    // change to the next square
    if (i == 1) {
      x = 4;
      y = 1;            
    } else if (i == 2) {
      x = 7;
      y = 1;      
    } else if (i == 3) {
      x = 1;
      y = 4;            
    } else if (i == 4) {
      x = 4;
      y = 4;            
    } else if (i == 5) {
      x = 7;
      y = 4;            
    } else if (i == 6) {
      x = 1;
      y = 7;            
    } else if (i == 7) {
      x = 4;
      y = 7;            
    } else if (i == 8) {
      x = 7;
      y = 7;                        
    }
    
    
  }
  

  return cont;
}

function nCheckHoriz(possNums, xx, removePoss){
  var temp = 0;
  var cont = false;

  for (var y=1; y<10; y++) {
    var t = document.getElementById("h" + xx + "" + y).value;
      if (t != "") {
        if (t.length == 2 && (possNums.indexOf(t.substr(0,1)) > -1) && (possNums.indexOf(t.substr(1,1)) > -1)) {
          temp++;
        } else if (t.length == 3 && (possNums.indexOf(t.substr(0,1)) > -1) && (possNums.indexOf(t.substr(1,1)) > -1) && (possNums.indexOf(t.substr(2,1)) > -1)) {       
          temp++;
        } else if (removePoss) {
          // alert("going to attempt removing " + possNums + " from " + x + " " + y);
          for (var k = 0; k < possNums.length; k++) {
            if ((t.indexOf(possNums.substr(k , 1))) > -1) {
              t = t.replace(possNums.substr(k,1), "");
              document.getElementById("h" + xx + "" + y).value = t;
              cont = true;
            } 
          }
        }
      }       
  }
  if (cont) {
    return true;
  } else if (possNums.length == temp && removePoss == false) {
    return true;
  } else {
    return false;
  }
}


function nCheckVertical(possNums, yy, removePoss){
  var temp = 0;
  var cont = false;

  for (var x=1; x<10; x++) {
    var t = document.getElementById("h" + x + "" + yy).value;
      if (t != "") {
        if (t.length == 2 && (possNums.indexOf(t.substr(0,1)) > -1) && (possNums.indexOf(t.substr(1,1)) > -1)) {
          temp++;
        } else if (t.length == 3 && (possNums.indexOf(t.substr(0,1)) > -1) && (possNums.indexOf(t.substr(1,1)) > -1) && (possNums.indexOf(t.substr(2,1)) > -1)) {       
          temp++;
        } else if (removePoss) {
          for (var k = 0; k < possNums.length; k++) {
            if ((t.indexOf(possNums.substr(k , 1))) > -1) {
              t = t.replace(possNums.substr(k,1), "");
              document.getElementById("h" + x + "" + yy).value = t;
              cont = true;
            } 
          }
        }
      }
  }
  if (cont) {
    return true;
  } else if (possNums.length == temp && removePoss == false) {
    return true;
  } else {
    return false;
  }
}


function nCheckSquare(possNums, xx, yy, removePoss){
  var x,y;
  var temp = 0;
  var cont = false;
  var firstTime = true;
  var oddNumber = 0;

  // sorting out which square to loop from
  if (xx < 4) {
    x = 1;
  } else if (xx < 7) {
    x = 4;
  } else {
    x = 7;
  }

  if (yy < 4) {
    y = 1;
  } else if (yy < 7) {
    y = 4;
  } else {
    y = 7;
  }
  // end
  
  for (var i=1; i<4; i++) {
    for (var j=1; j<4; j++) { // TODO:: Check if + "" + is needed on all browsers
      var t = document.getElementById("h" + x + "" + y).value;
      if (t != "") {
        if (t.length == 2 && (possNums.indexOf(t.substr(0,1)) > -1) && (possNums.indexOf(t.substr(1,1)) > -1)) {
          temp++;
        } else if (t.length == 3 && (possNums.indexOf(t.substr(0,1)) > -1) && (possNums.indexOf(t.substr(1,1)) > -1) && (possNums.indexOf(t.substr(2,1)) > -1)) {       
          temp++;
        } else if ((t.length == 2) && ((possNums.indexOf(t.substr(0,1)) > -1) || (possNums.indexOf(t.substr(1,1)) > -1))) {
          if (possNums.indexOf(t.substr(0,1)) > -1) {
            if (firstTime) {
              firstTime = false;
              oddNumber = t.substr(1,1);
            } else if (oddNumber == t.substr(1,1)){
              temp++;
            }
          } else if (possNums.indexOf(t.substr(1,1)) > -1) {
            if (firstTime) {
              firstTime = false;
              oddNumber = t.substr(0,1);
            } else if (oddNumber == t.substr(0,1)){
              temp++;
            }         
          }
        } else if (removePoss) {
          //alert("going to attempt removing " + possNums + " from " + x + " " + y);
          for (var k = 0; k < possNums.length; k++) {
            if ((t.indexOf(possNums.substr(k , 1))) > -1) {
              t = t.replace(possNums.substr(k,1), "");
              document.getElementById("h" + x + "" + y).value = t;
              cont = true;
            } 
          }
        }
      }
      x++;
    }
    y++;
    x = x - 3;
  }

  if (oddNumber > 0) {
    //alert (possNums + "" + oddNumber);
  }
  if (cont) {
    return true;
  } else if (possNums.length == temp && removePoss == false) {
    return true;
  } else {
    return false;
  }
}
*/