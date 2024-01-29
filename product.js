const getProduct = async () => {
    const {search} =  location;

    // console.log(search);
    const [,id] = search.split("=");
    // console.log(id);


    
    const api = `https://fakestoreapi.com/products/${id}`;

    const res = await fetch(api);

    const data = await res.json();

    console.log(data);
    const product =document.getElementById('product');

    product.innerHTML = `
    <div class="productSingle  d-flex m-auto ">
        <img src="${data.image}" alt="${data.title}">
        <h3 class="d-flex m-auto mt-3 text-center title">${data.title}</h3>
        <h6 class="d-flex m-auto my-3 category">${data.category}</h6>
        <p class="pd" class="d-flex m-auto text-center description">${data.description}</p>
        <div class="d-flex justify-content-between align-items-center">
            <h5>$${data.price}</h5>
            <div>
            
            <a href="./updateProduct.html?id=${id}" class="btn btn-secondary border-0 text-white">Update</a>
           
            <button type="button" class="btn btn-danger btn-delete" onclick="showPopup();">Delete</button>
            </div>
        </div>
    </div> 
    `;

} 

getProduct();




function deleteProduct() {

    const {search} =  location;
    const [,id] = search.split("=");
 
  
    

    const apiUrl = `https://fakestoreapi.com/products/${id}`; 
  
    fetch(apiUrl, {
      method: 'DELETE', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: null,
    })
    .then(response => {
      console.log(response);
      if (!response.ok) {
        throw new Error('Network response was not ok');
        
      }
      return response.json();
    })
    .then(data => {
  

    })
    .catch(error => {
      alert("Error while deleting product");
      console.error('Error:', error);
  
    });
  }



  function showPopup() {
    document.getElementById('container1').style.display = "flex";
};

function hidePopup() {
  document.getElementById('container1').style.display = "none";
};