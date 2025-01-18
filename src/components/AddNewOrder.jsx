import React from 'react'
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Center from "@/components/Center";
import axios from "axios";
import { z } from "zod";



const API = import.meta.env.VITE_API ;

const itemSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required"),
  items: z
    .array(
      z.object({
        sku: z
          .string()
          .min(1, "SKU is required"),
        quantity: z
          .string()
          .min(1, "Quantity is required"),
      })
    )
    .nonempty("Items array cannot be empty"),
});

const AddNewOrder = () => {
  const [formData, setFormData] = useState({
    username: "",
    items: [
      {
        sku: "",
        quantity: "",
      },
    ],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedItems = [...prev.items];
      updatedItems[index] = { ...updatedItems[index], [name]: value };
      return { ...prev, items: updatedItems };
    });
  };

  const addNewItem = () => {
    if(formData.items[formData.items.length -1].sku != "" && formData.items[formData.items.length -1].quantity != "" ){
      setFormData((prev) => ({
        ...prev,
        items: [...prev.items, { sku: "", quantity: "" }],
      }));
    }
  };

  const addOrder = async (e) => {
    e.preventDefault();
    try {
      const parsedData = itemSchema.parse(formData);

      const DataToBeSent = {
        customer: {
          username: parsedData.username,
        },
        line_Items: parsedData.items,
      };

      const token = localStorage.getItem("token");
      const target = `${API}orders/create`;

      const response = await axios.post(target, DataToBeSent, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200 || response.status === 201) {
        console.log(response.data);
        toast.success("Order added successfully", {
          position: "top-right",
          autoClose: 3000,
        });
        setFormData({
          username: "",
          items: [{ sku: "", quantity: "" }],
        });
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

  return (
    <Center>
      <div className="flex flex-col gap-4 items-center w-full">
        <h2 className="textGradient text-5xl md:text-6xl font-semibold text-white">Add Order</h2>
        <form
          onSubmit={addOrder}
          className="grid grid-cols-12 w-[90%] md:w-[50%] gap-y-8 gap-x-4 items-center border shadow-lg shadow-slate-500 border-white rounded-2xl mx-6 md:mx-0 px-4 md:px-8 py-6 max-h-[50vh] overflow-y-auto"
        >
          <div className="col-span-12 flex flex-col gap-2">
            <label className="text-white text-lg">Username</label>
            <input
              name="username"
              className="p-2 rounded-md bg-transparent border text-white"
              value={formData.username}
              onChange={handleInputChange}
            />
          </div>

          {formData.items.map((item, i) => (
            <React.Fragment key={i}>
              <div className={`col-span-5 flex flex-col gap-2 ${formData.items.length - 1 > i ? "col-span-6" : ""}`}>
                <label className="text-white text-lg">SKU</label>
                <input
                  name="sku"
                  className="p-2 rounded-md bg-transparent border text-white"
                  value={item.sku}
                  onChange={(e) => handleItemChange(i, e)}
                />
              </div>

              <div className={`col-span-5 flex flex-col gap-2 ${formData.items.length - 1 > i ? "col-span-6" : ""}`}>
                <label className="text-white text-lg">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  className="p-2 rounded-md bg-transparent border text-white"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(i, e)}
                />
              </div>

              <div className={`col-span-2 flex flex-col gap-2 justify-center ${formData.items.length - 1 > i ? "hidden" : ""}`}>
                <span className="text-white text-lg">Add</span>
                <button
                  type="button"
                  className="bg-green-600 py-1 rounded-md text-white text-2xl font-bold"
                  onClick={addNewItem}
                >
                  +
                </button>
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
      </div>
    </Center>
  );
};

export default AddNewOrder;
