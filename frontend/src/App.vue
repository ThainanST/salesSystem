<script setup lang="ts">
    import { inject, onMounted, reactive, ref } from 'vue';
    import Order from './domain/Order';
    import CheckoutGateway from './infra/gateway/CheckoutGateway';
    import ProductsGateway from './infra/gateway/ProductsGateway';

    const products = reactive([
        { idProduct: 1, description: 'A', price: 1000 },
        { idProduct: 2, description: 'B', price: 5000 },
        { idProduct: 3, description: 'C', price: 30 },
    ]);

    const order = reactive( new Order("987.654.321-00") );
    const checkoutGateway = inject("CheckoutGateway") as CheckoutGateway;
    const productsGateway = inject("ProductsGateway") as ProductsGateway;
    
    const message = ref("");

    const getProductById = function (idProduct: number) {
        const product = products.find( product => product.idProduct === idProduct);
        return product;
    }

    const formatCurrency = function (value: number) {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    }

    const confirm = async function (order: any) {
        const orderData = await checkoutGateway.checkout(order);
        console.log("ORDER DATA ", orderData);
        order.code = orderData.code;
        order.total = orderData.total;
        message.value = "Success";
    }

    onMounted( async () => {
        try {
            const productsData = await productsGateway.getProducts();
            products.push(...productsData);

        } catch (error) {
            console.error("ONMOUNTED ERROR ", error);
        }
    });

    async function sleep (time: number) {
    return new Promise((resolve) => setTimeout(() => {resolve(true)}, time));
}

</script>

<template>
    <div class="title">Checkout</div>
    <div v-for="product in products">
        <span class="product-description">{{ product.description }}</span>
        <span class="product-price">{{ formatCurrency(product.price) }}</span>
        <button class="product-add-button" @click="order.addItem(product)">add</button>
    </div>
    <span class="total">{{ formatCurrency( order.getTotal() ) }}</span>
    <div v-for="item in order.items">
        <span class="item-description"> {{ getProductById(item.idProduct)?.description }}</span>
        <span class="item-quantity">{{ item.quantity }}</span>
        <button class="item-increase-button" @click="order.increaseItem(item.idProduct)">+</button>
        <button class="item-decrease-button" @click="order.decreaseItem(item.idProduct)">-</button>
    </div>
    <button class="confirm" @click="confirm(order)">Confirm</button>
    <div class="message">{{ message }}</div>
    <div class="order-code">{{ order.code }}</div>
    <div class="order-total">{{ formatCurrency(order.total) }}</div>
</template>

<style scoped>
</style>
