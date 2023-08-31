let addIngredientsBtn = document.getElementById('addIngredientsBtn');
let ingredientList = document.querySelector('.ingredientList');
let ingredeintDiv = document.querySelectorAll('.ingredeintDiv')[0];
addIngredientsBtn.addEventListener('click', () => {
    let newIngredient = ingredeintDiv.cloneNode(true);
    let input = newIngredient.getElementsByTagName('input')[0];
    input.value = '';
    ingredientList.appendChild(newIngredient);
})
const deleteLinks = document.querySelectorAll('.delete');
