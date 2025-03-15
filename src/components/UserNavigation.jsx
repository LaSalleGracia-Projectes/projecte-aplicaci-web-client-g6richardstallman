<Link 
  href="/orders" 
  className={`flex items-center gap-2 p-2 rounded-md ${
    activeLink === '/orders' ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'
  }`}
>
  <FaShoppingBag className="text-gray-600" />
  <span>Mis Pedidos</span>
</Link> 