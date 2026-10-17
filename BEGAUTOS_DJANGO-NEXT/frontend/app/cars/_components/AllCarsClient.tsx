// app/cars/_components/AllCarsClient.tsx
import { Suspense } from "react";
import CarsClient from "./CarsClient";
import {
  CategoryShortDescription,
  CategoryLongDescription,
} from "./CategoryCopy";
import { CAR_TYPE_CONFIGS, BrandType, ModelType, BodyStyleType } from "./types";

type Car = {
  id: number;
  name: string;
  brand: string;
  model: string;
  year: number;
  engine_capacity: string;
  fuel_type: string;
  mileage: string;
  price: string | number;
  feature_image: string | null;
  body_style?: number;
  car_type?: string;
  registered: string;
  availability?: string;
  slug?: string;
};

interface AllCarsClientProps {
  brands: BrandType[];
  models: ModelType[];
  bodyStyles: BodyStyleType[];
  colors: string[];
  initialCars?: Car[];
  initialTotalPages?: number;
  // Admin-editable copy (CategoryPageSEO). Falls back to CAR_TYPE_CONFIGS.
  h1Title?: string | null;
  shortDescription?: string | null;
  longDescription?: string | null;
}

export default function AllCarsClient({
  brands,
  models,
  bodyStyles,
  colors,
  initialCars,
  initialTotalPages,
  h1Title,
  shortDescription,
  longDescription,
}: AllCarsClientProps) {
  const config = CAR_TYPE_CONFIGS["all"];

  return (
    <div className="bg-page text-ink min-h-screen container-responsive">
      <div className="container mx-auto px-4 pt-20">
        <h1 className="text-4xl font-bold pt-20 mb-5">
          {h1Title || config.title}
        </h1>

        {shortDescription ? (
          <CategoryShortDescription html={shortDescription} />
        ) : (
          <p className="text-muted sm:w-40 md:w-3xl lg:w-4xl mb-10 text-justify">
            {config.description}
          </p>
        )}

        <Suspense fallback={null}>
          <CarsClient
            config={config}
            brands={brands || []}
            models={models || []}
            bodyStyles={bodyStyles || []}
            colors={colors || []}
            initialCars={initialCars}
            initialTotalPages={initialTotalPages}
          />
        </Suspense>

        {longDescription && <CategoryLongDescription html={longDescription} />}
      </div>
    </div>
  );
}
