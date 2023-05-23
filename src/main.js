const tableBody = document.querySelector('#tableBody')
const btnModal = document.querySelector('#btnModal')
const myModal = document.querySelector("#myModal")
const form = document.querySelector('#myForm')
const spinnerModal = document.querySelector('#spinner-modal')
const modalTitle = document.querySelector('.modal-title')
const deleteConfirm = document.querySelector('#deleteConfirm')
const baseAPI = 'https://api.escuelajs.co/api/v1';
let deleteFunction;


const fetchData = async (urlApi, options = {}) => {
    try {
        const response = await fetch(urlApi, options);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error)
    }
}


const getAllProducts = async (urlApi) => {
    let url = `${urlApi}/products`
    let productsAPI = '';
    const products = await fetchData(url);
    products.forEach((element, index) => {
        productsAPI += `
            <tr>
                <th scope="row">${index + 1}</th>
                <td>${element.title}</td>
                <td>${element.price}</td>
                <td>${element.description}</td>
                <td>${element.category.name}</td>
                <td><img src="${element.images}" class="img-fluid" style="width: 120px"></td>
                <td styleconst tableBody = document.querySelector('#tableBody')
                const btnModal = document.querySelector('#btnModal')
                const myModal = document.querySelector("#myModal")
                const form = document.querySelector('#myForm')
                const spinnerModal = document.querySelector('#spinner-modal')
                const modalTitle = document.querySelector('.modal-title')
                const deleteConfirm = document.querySelector('#deleteConfirm')="height: 100%">
                    <div class="d-flex gap-2">
                        <button type="button" name="editar" value="${element.id}" class="btn btn-outline-info" data-bs-toggle="modal" data-bs-target="#myModal"
                            data-bs-whatever="@Modal">
                            <i class="bi bi-pencil-square" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Editar"></i>
                        </button>
                        <button onclick="deleteProduct(${element.id})" type="button" name="eliminar" value="${element.id}" class="btn btn-outline-danger" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Eliminar">
                            <i class="bi bi-trash3-fill"></i>
                        </button>
                    </div>
                </td>
            </tr>`
    });
    tableBody.innerHTML = productsAPI;
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
}

const createOrUpdateProduct = async (event) => {
    let title = document.querySelector('#titleProduct').value;
    let description = document.querySelector('#descriptionProduct').value;
    let price = document.querySelector('#priceProduct').value;
    let category = document.querySelector('#selectCategory').value;
    let image = document.querySelector('#imageProduct').value;
    let product;
    let url = `${baseAPI}/products`
    let options = {
        headers: {
            "Content-type": "application/json"
        },
        method: 'POST',
        body: JSON.stringify({
            title,
            price,
            description,
            "categoryId": category,
            "images": [image]
        })
    }

    switch (event.target.name) {
        case 'crear':
            product = await fetchData(url, options);
            alert(`Su producto ${product.title} ha sido agregado`);
            getAllProducts(baseAPI);
            break;

        case 'actualizar':
            url = `${url}/${event.target.value}`
            options = {
                headers: {
                    "Content-type": "application/json"
                },
                method: 'PUT',
                body: JSON.stringify({
                    title,
                    price,
                    description,
                    "categoryId": category,
                    "images": [image]
                })
            }
            product = await fetchData(url, options)
            alert(`Su producto ${product.title} ha sido actualizado`)
            getAllProducts(baseAPI);
            break;
        default:
            break;
    }
}

const deleteProduct = (id) => {
    const toastLiveExample = document.getElementById('liveToast')
    const toast = new bootstrap.Toast(toastLiveExample)
    toast.show()
    
    deleteFunction = async () => {
        try {
            let options = {
                headers: {
                    "Content-type": "application/json"
                },
                method: 'DELETE',
            }
            await fetchData(`${baseAPI}/products/${id}`, options)
            toast.hide();
            alert('Se ha eliminado');
            getAllProducts(baseAPI);
        } catch (error) {
            console.error(error)
        }
    }    

}

myModal.addEventListener('shown.bs.modal', async (event) => {
    switch (event.relatedTarget.name) {
        case 'crear':
            modalTitle.textContent = 'Ingresara un nuevo producto'
            btnModal.textContent = 'Crear producto'
            btnModal.name = 'crear'
            btnModal.value = ''
            form.classList.remove('d-none')
            spinnerModal.classList.add('d-none')
            break;
        case 'editar':
            let id = event.relatedTarget.value;
            modalTitle.textContent = 'Editara el producto'
            btnModal.textContent = 'Actualizar producto'
            btnModal.name = 'actualizar'
            btnModal.value = id
            let product = await fetchData(`${baseAPI}/products/${id}`)
            spinnerModal.classList.add('d-none')
            form.classList.remove('d-none')
            document.querySelector('#titleProduct').value = product.title;
            document.querySelector('#descriptionProduct').value = product.description;
            document.querySelector('#priceProduct').value = product.price;
            document.querySelector('#selectCategory').value = product.category.id;
            document.querySelector('#imageProduct').value = product.images;

            break;
        default:
            break;
    }
})

myModal.addEventListener('hidden.bs.modal', () => {
    form.reset()
    spinnerModal.classList.remove('d-none')
    form.classList.add('d-none')
})

const categories = async () => {
    const categoriesProductSelect = document.querySelector('#selectCategory')
    const categoriesProduct = await fetchData(`${baseAPI}/categories`)
     categoriesProduct.forEach(element => {
        categoriesProductSelect.innerHTML += `
        <option value="${element.id}">${element.name}</option>
        `
    })
}

getAllProducts(baseAPI);
categories()