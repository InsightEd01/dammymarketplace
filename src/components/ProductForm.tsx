import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { fetchCategories } from "@/lib/services/categoryService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Category, Subcategory } from "@/types/supabase";
import { Loader2, Upload } from "lucide-react";

const productSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Product name must be at least 3 characters" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" }),
  price: z.coerce
    .number()
    .positive({ message: "Price must be a positive number" }),
  old_price: z.coerce
    .number()
    .positive({ message: "Old price must be a positive number" })
    .optional()
    .nullable(),
  category_id: z.string().min(1, { message: "Category is required" }),
  subcategory_id: z.string().optional().nullable(),
  stock_quantity: z.coerce
    .number()
    .int()
    .nonnegative({ message: "Stock quantity must be a non-negative integer" }),
  is_featured: z.boolean().default(false),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  productId?: string;
  onSuccess?: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ productId, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      old_price: null,
      category_id: "",
      subcategory_id: null,
      stock_quantity: 0,
      is_featured: false,
    },
  });

  const selectedCategoryId = watch("category_id");

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      const categoriesData = await fetchCategories();
      setCategories(categoriesData);
    };

    loadCategories();
  }, []);

  // Load subcategories when category changes
  useEffect(() => {
    if (selectedCategoryId) {
      const selectedCategory = categories.find(
        (cat) => cat.id === selectedCategoryId,
      );
      setSubcategories(selectedCategory?.subcategories || []);

      // Reset subcategory selection when category changes
      if (!productId) {
        setValue("subcategory_id", null);
      }
    } else {
      setSubcategories([]);
    }
  }, [selectedCategoryId, categories, setValue, productId]);

  // Load product data if editing
  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) return;

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", productId)
          .single();

        if (error) throw error;

        if (data) {
          // Set form values
          setValue("name", data.name);
          setValue("description", data.description || "");
          setValue("price", data.price);
          setValue("old_price", data.old_price || null);
          setValue("category_id", data.category_id || "");
          setValue("subcategory_id", data.subcategory_id || null);
          setValue("stock_quantity", data.stock_quantity);
          setValue("is_featured", data.is_featured || false);

          // Set image URL
          setImageUrl(data.image_url || "");
          setImagePreview(data.image_url || "");
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: `Failed to load product: ${error.message}`,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [productId, setValue, toast]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (): Promise<string> => {
    if (!imageFile) return imageUrl; // Return existing URL if no new file

    setIsUploading(true);
    try {
      // Create a unique file path
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error: any) {
      toast({
        title: "Upload Error",
        description: `Failed to upload image: ${error.message}`,
        variant: "destructive",
      });
      return imageUrl; // Return existing URL on error
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: ProductFormValues) => {
    setIsLoading(true);
    try {
      // Upload image if there's a new one
      const finalImageUrl = await uploadImage();

      // Ensure all required fields are properly defined
      const productData = {
        name: data.name,
        price: data.price,
        description: data.description || "",
        category_id: data.category_id,
        subcategory_id: data.subcategory_id || null,
        stock_quantity: data.stock_quantity,
        is_featured: data.is_featured,
        old_price: data.old_price || null,
        image_url: finalImageUrl,
      };

      let result;
      if (productId) {
        // Update existing product
        result = await supabase
          .from("products")
          .update(productData)
          .eq("id", productId)
          .select()
          .single();
      } else {
        // Create new product
        result = await supabase
          .from("products")
          .insert(productData)
          .select()
          .single();
      }

      if (result.error) throw result.error;

      toast({
        title: "Success",
        description: productId
          ? "Product updated successfully"
          : "Product created successfully",
      });

      if (!productId) {
        // Reset form for new product creation
        reset();
        setImageFile(null);
        setImagePreview("");
        setImageUrl("");
      }

      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to ${productId ? "update" : "create"} product: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && productId) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" {...register("name")} />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register("price")}
              />
              {errors.price && (
                <p className="text-sm text-red-500">{errors.price.message}</p>
              )}
            </div>

            {/* Old Price (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="old_price">Old Price (Optional)</Label>
              <Input
                id="old_price"
                type="number"
                step="0.01"
                {...register("old_price")}
              />
              {errors.old_price && (
                <p className="text-sm text-red-500">
                  {errors.old_price.message}
                </p>
              )}
            </div>

            {/* Stock Quantity */}
            <div className="space-y-2">
              <Label htmlFor="stock_quantity">Stock Quantity</Label>
              <Input
                id="stock_quantity"
                type="number"
                {...register("stock_quantity")}
              />
              {errors.stock_quantity && (
                <p className="text-sm text-red-500">
                  {errors.stock_quantity.message}
                </p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category_id">Category</Label>
              <Select
                value={watch("category_id")}
                onValueChange={(value) => setValue("category_id", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category_id && (
                <p className="text-sm text-red-500">
                  {errors.category_id.message}
                </p>
              )}
            </div>

            {/* Subcategory */}
            <div className="space-y-2">
              <Label htmlFor="subcategory_id">Subcategory (Optional)</Label>
              <Select
                value={watch("subcategory_id") || ""}
                onValueChange={(value) =>
                  setValue("subcategory_id", value || null)
                }
                disabled={!selectedCategoryId || subcategories.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {subcategories.map((subcategory) => (
                    <SelectItem key={subcategory.id} value={subcategory.id}>
                      {subcategory.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.subcategory_id && (
                <p className="text-sm text-red-500">
                  {errors.subcategory_id.message}
                </p>
              )}
            </div>

            {/* Featured Product */}
            <div className="flex items-center space-x-2">
              <Switch
                id="is_featured"
                checked={watch("is_featured")}
                onCheckedChange={(checked) => setValue("is_featured", checked)}
              />
              <Label htmlFor="is_featured">Featured Product</Label>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={5} {...register("description")} />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Image Upload */}
          <div className="space-y-4">
            <Label>Product Image</Label>
            <div className="flex flex-col md:flex-row gap-4 items-start">
              {/* Image Preview */}
              {imagePreview && (
                <div className="border rounded-md overflow-hidden w-40 h-40 flex items-center justify-center bg-gray-50">
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              )}

              {/* Upload Button */}
              <div className="flex-1">
                <Label
                  htmlFor="image"
                  className="cursor-pointer flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">
                    Click to upload image
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    PNG, JPG, WEBP up to 5MB
                  </span>
                </Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || isUploading}
          >
            {isLoading || isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isUploading ? "Uploading..." : "Saving..."}
              </>
            ) : productId ? (
              "Update Product"
            ) : (
              "Create Product"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductForm;
