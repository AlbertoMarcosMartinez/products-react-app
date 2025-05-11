import React, {useEffect, useState} from 'react'
import toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'
import axios from 'axios'

const Products = () => {
    const url = 'https://fakestoreapi.com/products'
    const [products, setProducts] = useState([]);
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
        await handleEditProduct();
    } else {
        await handleAddProduct();
    }
    
    // Cierro el modal y limpio los campos.
    setShowModal(false);
    setId('');
    setName('');
    setDescription('');
    setPrice('');
    setIsEditing(false);
};

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(url);
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchProducts();
    }, []);

    const handleAddProduct = async () => {
        try {
            const newProduct = {
                id: id,
                title: name,
                description: description,
                price: price
            };
            const response = await axios.post(url, newProduct);
            setProducts([...products, response.data]);
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    const handleEditProduct = async () => {
        try {
            const updatedProduct = {
                id: id,
                title: name,
                description: description,
                price: price
            };
            const response = await axios.put(`${url}/${id}`, updatedProduct);
            setProducts(products.map((product) => (product.id === id ? response.data : product)));
            
            toastify({
                text: "Producto actualizado correctamente",
                duration: 3000,
                gravity: "top",
                position: "right",
                style: {
                    background: "#4CAF50",
                    color: "white"
                }
            }).showToast();
        } catch (error) {
            console.error('Error updating product:', error);
            toastify({
                text: "Error al actualizar el producto",
                duration: 3000,
                gravity: "top",
                position: "right",
                style: {
                    background: "#FF6B6B",
                    color: "white"
                }
            }).showToast();
        }
    }

    return (
        <div>
            <div className='flex justify-between mb-4'>
                <h1 className='text-3xl font-bold'>Lista de productos</h1>
                <button className='bg-orange-700 text-black px-4 py-2 rounded' 
                    onClick={() =>{
                        setId('');
                        setName('');
                        setDescription('');
                        setPrice('');
                        setIsEditing(false);
                        setShowModal(true);
                    }}>
                    Nuevo Producto
                </button>       
            </div>
                        
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-8 rounded-lg w-96">
                        <h2 className="text-xl font-bold mb-4">
                            {isEditing ? 'Edit Product' : 'Add New Product'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block mb-2">ID:</label>
                                <input 
                                    type="text"
                                    value={id}
                                    onChange={(e) => setId(e.target.value)}
                                    className="w-full border p-2 rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2">Name:</label>
                                <input 
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Product Name"
                                    className="w-full border p-2 rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2">Description:</label>
                                <textarea 
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Product Description"
                                    className="w-full border p-2 rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2">Price:</label>
                                <input 
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    placeholder="Product Price"
                                    className="w-full border p-2 rounded"
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button 
                                    type="button"
                                    onClick={() =>{
                                        setShowModal(false);
                                        setId('');
                                        setName('');
                                        setDescription('');
                                        setPrice('');
                                        setIsEditing(false);    
                                    }}
                                    className="bg-gray-300 px-4 py-2 rounded">
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="bg-gray-300 text-black px-4 py-2 rounded">
                                    {isEditing ? 'Save Changes' : 'Add Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <table className='w-full border-collapse border'>
                <thead>
                    <tr className='bg-gray-100'>
                        <th className='border p-2 text-left'>Title</th>
                        <th className='border p-2 text-left'>Description</th>
                        <th className='border p-2 text-left'>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id} className='border'>
                            <td className='border p-2'>{product.title}</td>
                            <td className='border p-2'>{product.description}</td>
                            <td className='border p-2'>{product.price}€</td>
                            <td className='border p-2'>
                                <button 
                                    className='bg-blue-500 text-black px-4 py-2 rounded'
                                    onClick={() => {
                                        setId(product.id);
                                        setName(product.title);
                                        setDescription(product.description);
                                        setPrice(product.price);
                                        setShowModal(true);
                                        setIsEditing(true);
                                    }}>
                                    Edit
                                </button>
                            </td>
                            <td className='border p-2'>
                                <button 
                                    className='bg-red-500 text-black px-4 py-2 rounded'
                                    onClick={() => {
                                        setProducts(products.filter((p) => p.id !== product.id));
                                    }}>
                                    Delete
                                </button>
                            </td>   
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Products