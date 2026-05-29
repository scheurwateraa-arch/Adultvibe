import React from "react";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

const REGIONS = [
  "Noord-Holland", "Zuid-Holland", "Utrecht", "Noord-Brabant", 
  "Gelderland", "Limburg", "Overijssel", "Flevoland", 
  "Groningen", "Friesland", "Drenthe", "Zeeland", "België"
];

const INTEREST_TAGS = [
  "D/S", "NSA", "Dates", "Casual", "Sexting", "Roleplay", 
  "FWB", "ONS", "Voyeur", "Exhib", "BDSM", "Fetish"
];

export default function UserFilters({ filters, onChange }) {
  const hasActiveFilters = filters.gender || filters.region || 
    filters.onlineOnly || filters.interests?.length > 0 || 
    filters.ageMin !== 18 || filters.ageMax !== 99;

  const clearFilters = () => {
    onChange({
      search: "",
      gender: "",
      region: "",
      onlineOnly: false,
      interests: [],
      ageMin: 18,
      ageMax: 99
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Search bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <Input
            placeholder="Zoek op naam..."
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="pl-10 bg-gray-800/50 border-gray-700 text-white"
          />
        </div>

        {/* Quick filters for desktop */}
        <div className="hidden md:flex gap-2">
          <Select 
            value={filters.gender} 
            onValueChange={(v) => onChange({ ...filters, gender: v })}
          >
            <SelectTrigger className="w-32 bg-gray-800/50 border-gray-700 text-white">
              <SelectValue placeholder="Geslacht" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="all">Alle</SelectItem>
              <SelectItem value="man">Man</SelectItem>
              <SelectItem value="vrouw">Vrouw</SelectItem>
              <SelectItem value="non-binair">Non-binair</SelectItem>
            </SelectContent>
          </Select>

          <Select 
            value={filters.region} 
            onValueChange={(v) => onChange({ ...filters, region: v })}
          >
            <SelectTrigger className="w-40 bg-gray-800/50 border-gray-700 text-white">
              <SelectValue placeholder="Regio" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="all">Alle regio's</SelectItem>
              {REGIONS.map(r => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant={filters.onlineOnly ? "default" : "outline"}
            onClick={() => onChange({ ...filters, onlineOnly: !filters.onlineOnly })}
            className={filters.onlineOnly 
              ? "bg-green-600 hover:bg-green-700" 
              : "border-gray-700 text-gray-400 hover:bg-gray-800"
            }
          >
            <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
            Online
          </Button>
        </div>

        {/* Filter button for mobile + advanced */}
        <Sheet>
          <SheetTrigger asChild>
            <Button 
              variant="outline" 
              className="border-gray-700 text-gray-400 hover:bg-gray-800 relative"
            >
              <Filter className="w-5 h-5" />
              {hasActiveFilters && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500 rounded-full"></span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent className="bg-gray-900 border-gray-800 text-white">
            <SheetHeader>
              <SheetTitle className="text-white flex items-center justify-between">
                Filters
                {hasActiveFilters && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters}
                    className="text-pink-400 hover:text-pink-300"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Reset
                  </Button>
                )}
              </SheetTitle>
            </SheetHeader>
            
            <div className="space-y-6 mt-6">
              {/* Gender */}
              <div>
                <Label className="text-gray-300 mb-2 block">Geslacht</Label>
                <Select 
                  value={filters.gender} 
                  onValueChange={(v) => onChange({ ...filters, gender: v })}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Alle" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="all">Alle</SelectItem>
                    <SelectItem value="man">Man</SelectItem>
                    <SelectItem value="vrouw">Vrouw</SelectItem>
                    <SelectItem value="non-binair">Non-binair</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Region */}
              <div>
                <Label className="text-gray-300 mb-2 block">Regio</Label>
                <Select 
                  value={filters.region} 
                  onValueChange={(v) => onChange({ ...filters, region: v })}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Alle regio's" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="all">Alle regio's</SelectItem>
                    {REGIONS.map(r => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Age range */}
              <div>
                <Label className="text-gray-300 mb-4 block">
                  Leeftijd: {filters.ageMin} - {filters.ageMax}
                </Label>
                <div className="space-y-4">
                  <div>
                    <span className="text-xs text-gray-500">Minimum</span>
                    <Slider
                      value={[filters.ageMin]}
                      min={18}
                      max={99}
                      step={1}
                      onValueChange={([v]) => onChange({ ...filters, ageMin: v })}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Maximum</span>
                    <Slider
                      value={[filters.ageMax]}
                      min={18}
                      max={99}
                      step={1}
                      onValueChange={([v]) => onChange({ ...filters, ageMax: v })}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>

              {/* Online only */}
              <div className="flex items-center gap-3">
                <Checkbox
                  id="onlineOnly"
                  checked={filters.onlineOnly}
                  onCheckedChange={(c) => onChange({ ...filters, onlineOnly: c })}
                  className="border-purple-500 data-[state=checked]:bg-green-500"
                />
                <label htmlFor="onlineOnly" className="text-gray-300 cursor-pointer">
                  Alleen online gebruikers
                </label>
              </div>

              {/* Interests */}
              <div>
                <Label className="text-gray-300 mb-2 block">Interesses</Label>
                <div className="flex flex-wrap gap-2">
                  {INTEREST_TAGS.map(tag => (
                    <Badge
                      key={tag}
                      variant={filters.interests?.includes(tag) ? "default" : "outline"}
                      onClick={() => {
                        const current = filters.interests || [];
                        onChange({
                          ...filters,
                          interests: current.includes(tag)
                            ? current.filter(t => t !== tag)
                            : [...current, tag]
                        });
                      }}
                      className={`cursor-pointer ${
                        filters.interests?.includes(tag)
                          ? "bg-pink-500 hover:bg-pink-600"
                          : "border-gray-600 text-gray-400 hover:border-pink-500"
                      }`}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Active filters display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-gray-500 text-sm">Actieve filters:</span>
          {filters.gender && filters.gender !== 'all' && (
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
              {filters.gender}
              <X 
                className="w-3 h-3 ml-1 cursor-pointer" 
                onClick={() => onChange({ ...filters, gender: "" })}
              />
            </Badge>
          )}
          {filters.region && filters.region !== 'all' && (
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
              {filters.region}
              <X 
                className="w-3 h-3 ml-1 cursor-pointer" 
                onClick={() => onChange({ ...filters, region: "" })}
              />
            </Badge>
          )}
          {filters.onlineOnly && (
            <Badge variant="secondary" className="bg-green-500/20 text-green-300">
              Online
              <X 
                className="w-3 h-3 ml-1 cursor-pointer" 
                onClick={() => onChange({ ...filters, onlineOnly: false })}
              />
            </Badge>
          )}
          {filters.interests?.map(tag => (
            <Badge key={tag} variant="secondary" className="bg-pink-500/20 text-pink-300">
              {tag}
              <X 
                className="w-3 h-3 ml-1 cursor-pointer" 
                onClick={() => onChange({ 
                  ...filters, 
                  interests: filters.interests.filter(t => t !== tag) 
                })}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}