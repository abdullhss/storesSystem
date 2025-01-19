import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { z } from "zod";
import { useLocation } from "react-router-dom";
const API = import.meta.env.VITE_API;

const itemSchema = z.object({
  id: z.number().min(1, "Username is required"),
  items: z
    .array(
      z.object({
        barcode: z.string().min(1, "Barcode is required"),
        quantity: z.number().min(1, "Quantity is required"),
      })
    )
    .nonempty("Items cannot be empty"),
});

const Prepare = () => {
    const location = useLocation();
    const { orderId } = location.state || {};
    console.log(orderId);
    
    const [formData, setFormData] = useState({
        id: null,
        items: [
            {
                barcode: "",
                quantity: 0,
            },
        ],
    });
    
    const [products, setProducts] = useState([]);
    console.log(products);

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedItems = [...prev.items];
      updatedItems[index] = { ...updatedItems[index], [name]: value };
      return { ...prev, items: updatedItems };
    });
  };

  const addToProducts = (barcode) => {
    setProducts((prevProducts) => {
      const existingProduct = prevProducts.find(
        (product) => product.barcode === barcode
      );
  
      if (existingProduct) {
        return prevProducts.map((product) =>
          product.barcode === barcode
            ? { ...product, quantity: product.quantity + 1 }
            : product
        );
      } else {
        return [...prevProducts, { barcode, quantity: 1 }];
      }
    });
  };
  

  const addToShipment = async (e) => {
    e.preventDefault();
    try {
      const dataToBeSent = {
        id : orderId , 
        items : products
      }
      const token = localStorage.getItem("token");
      const target = `${API}storage/prepare`;

      const response = await axios.post(target, dataToBeSent, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("Order prepeard successfully", {
          position: "top-right",
          autoClose: 3000,
        });
        setFormData({
          id: null,
          items: [{ barcode: "", quantity: 1 }],
        });
        setProducts([]);
      } else {
        toast.error("Error adding item", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message, {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        console.error("Error adding order :", error);
        toast.error("Unexpected error occurred", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  };

  const deleteProduct = (barcode) => {
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.barcode !== barcode)
    );
  };

  return (
    <div className="flex flex-col gap-4 items-center w-full mt-8">
      <h2 className="textGradient text-5xl md:text-4xl font-semibold text-white">
        Prepare To Shipping
      </h2>
      <form
        onSubmit={addToShipment}
        className="grid grid-cols-12 w-[90%] md:w-[50%] gap-y-8 gap-x-4 items-center border shadow-lg shadow-slate-500 border-white rounded-2xl mx-6 md:mx-0 px-4 md:px-8 py-6 max-h-[50vh] overflow-y-auto"
      >
        {formData.items.map((item, i) => (
          <React.Fragment key={i}>
            <div
              className={`col-span-10 flex flex-col gap-2 ${
                formData.items.length - 1 > i ? "col-span-6" : ""
              }`}
            >
              <label className="text-white text-lg">Barcode</label>
              <input
                name="barcode"
                type="string"
                className="p-2 rounded-md bg-transparent border text-white"
                value={item.barcode}
                onChange={(e) => handleItemChange(i, e)}
              />
            </div>
            <div className="col-span-2 flex flex-col gap-2">
                <span className="text-white text-lg ">add</span>
                <div className="flex items-center justify-center gap-2">
                    <button
                    type="button"
                    className="text-white bg-green-500 w-full rounded-md py-2"
                    onClick={() => {
                        addToProducts(item.barcode);
                    }}
                    >
                    +
                    </button>
                </div>
            </div>
          </React.Fragment>
        ))}

        <div className="col-span-12 flex items-center justify-center">
          <button
            type="submit"
            className="text-white px-6 py-2 rounded-lg bg-[#4C5365] hover:bg-[#5A6172] gradient-btn duration-300"
          >
            Submit
          </button>
        </div>
      </form>
      {products.length > 0 && (
        <div>
          <table className="min-w-full table-auto text-sm text-left">
            <thead className="bg-gray-800 text-gray-200">
              <tr>
                <th className="px-6 py-3 border-b border-gray-700 font-bold text-center">
                  Barcode
                </th>
                <th className="px-6 py-3 border-b border-gray-700 font-bold text-center">
                  Quantity
                </th>
                <th className="px-6 py-3 border-b border-gray-700 font-bold text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((item, i) => (
                <tr
                  key={item.barcode}
                  className={`text-center ${
                    i % 2 === 0 ? "bg-gray-800" : "bg-gray-700"
                  } hover:bg-gray-600 transition-colors duration-200`}
                >
                  <td className="px-6 py-3 border-b border-gray-700">
                    {item.barcode}
                  </td>
                  <td className="px-6 py-3 border-b border-gray-700">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-3 border-b border-gray-700">
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                      onClick={() => deleteProduct(item.barcode)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Prepare;
