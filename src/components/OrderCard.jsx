import { ArrowDown } from 'lucide-react'
import { FiCheckCircle, FiEdit, FiInfo, FiTruck } from 'react-icons/fi'
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAreYouSure } from '@/contexts/AreYouSure';


const OrderCard = ({
    item ,
    i ,
    actionsConfig ,
    isAdmin = false, 
    handleUpdateOrder ,
    confirmOrder,       
    holdOrder,          
    cancelOrder,        
    handlePendingDelivery,
    handledeliver ,
    shippingServices ,
    selectedService, 
    setSelectedService
}) => {

    const [openDropdownId, setOpenDropdownId] = useState(null);
    const [selectedAction, setSelectedAction] = useState(null);
    
    const {setAreYouSurePopup} = useAreYouSure() ; 


    const navigate = useNavigate();
    const ActionComponent = actionsConfig?.[item.status];

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
    };

    const getStatusColor = (status) => {
        switch (status) {
        case 'New': return 'bg-blue-500/20 text-blue-500';
        case 'Confirmed': return 'bg-purple-500/20 text-purple-500';
        case 'Ready for Shipping': return 'bg-yellow-500/20 text-yellow-500';
        case 'Delivered': return 'bg-green-500/20 text-green-500';
        default: return 'bg-gray-500/20 text-gray-500';
        
        }
    };


    return (
    <motion.div
        key={item.id}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        transition={{ duration: 0.3, delay: i * 0.05 }}
        className="bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
    >
        <div className="flex justify-between items-start mb-4">
            <div>
                <h3 className="text-lg font-semibold text-white">Order #{item.id}</h3>
                <p className="text-sm text-gray-400">{item.customer.name}</p>
            </div>
            <span className={`${getStatusColor(item.status)} px-3 py-1 rounded-full text-sm`}>
                {item.status}
            </span>
        </div>

        <div className="space-y-3 mb-6">
            <div className="flex items-center text-sm">
                <FiTruck className="mr-2 text-gray-400" />
                <span className="text-gray-300">{item.customer.phoneNumber}</span>
            </div>
        <div className="flex items-center text-sm">
            <FiInfo className="mr-2 text-gray-400" />
            <span className="text-gray-300">{item.cart.length} items</span>
        </div>
        <div className="flex items-center text-sm">
            <FiCheckCircle className="mr-2 text-gray-400" />
            <span className="text-emerald-400 font-semibold">EGP {item.total}</span>
        </div>
        </div>

        <div className="border-t border-gray-700 pt-4">
        <div className="flex items-center justify-between gap-2">
            <button
            onClick={() => navigate("/OrderPreview", { state: { orderId: item.id } })}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-lg transition-all"
            >
            <FiInfo className="text-base" />
            Details
            </button>
            
            {ActionComponent && (
                <ActionComponent
                    item={item}
                    selectedAction={selectedAction}
                    setSelectedAction={setSelectedAction}
                    openDropdownId={openDropdownId}
                    setOpenDropdownId={setOpenDropdownId}
                    selectedService={selectedService}
                    setSelectedService={setSelectedService}
                    setAreYouSurePopup={setAreYouSurePopup}
                    confirmOrder={confirmOrder}
                    holdOrder={holdOrder}
                    cancelOrder={cancelOrder}
                    handlePendingDelivery={handlePendingDelivery}
                    handledeliver={handledeliver}
                    shippingServices={shippingServices}
                />
          )}

            {isAdmin && (
                <div className="flex gap-2">
                    <button
                    onClick={() => handleUpdateOrder(item)}
                    className="p-2 hover:bg-gray-700 rounded-lg text-gray-300 transition-all"
                    >
                    <FiEdit className="text-lg" />
                    </button>
                    {/* <button
                    onClick={() => deleteOrder(item.id)}
                    className="p-2 hover:bg-red-600/20 text-red-400 rounded-lg transition-all"
                    >
                    <FiTrash2 className="text-lg" />
                    </button> */}
                </div>
            )}
        </div>
        </div>
    </motion.div>
  )
}

export default OrderCard
