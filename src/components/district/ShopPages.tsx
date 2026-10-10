import { useEffect, useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, ArrowRight, ArrowUpRight, MapPin, Star, Search, ShieldCheck, ShoppingBag, Plus, Minus, X, Gift, Check, Package } from 'lucide-react';
import { categories, cityCatalog, findBusiness, paymentMethods, type Product } from '@/data/district/catalog';
import { useBank, type CartItem } from '@/lib/DistrictBankContext';
import { money, bill, batchCost, canPay } from '@/lib/commerce';
