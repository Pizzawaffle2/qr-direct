"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { QRStyleOptions } from "@/lib/types/qr-styles"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const styleSchema = z.object({
  width: z.number().min(100).max(1000),
  margin: z.number().min(0).max(50),
  shape: z.enum(["square", "rounded", "dots"]),
  errorCorrection: z.enum(["L", "M", "Q", "H"]),
  colorScheme: z.object({
    background: z.string(),
    foreground: z.string(),
    gradient: z
      .object({
        type: z.enum(["linear", "radial"]),
        start: z.string(),
        end: z.string(),
        direction: z.number().optional(),
      })
      .optional(),
  }),
  logo: z
    .object({
      image: z.string(),
      size: z.number(),
      margin: z.number(),
    })
    .optional(),
})

interface StyleFormProps {
  defaultValues?: Partial<QRStyleOptions>
  onChange: (values: Partial<QRStyleOptions>) => void
}

export function StyleForm({ defaultValues, onChange }: StyleFormProps) {
  const form = useForm<z.infer<typeof styleSchema>>({
    resolver: zodResolver(styleSchema),
    defaultValues: {
      width: 300,
      margin: 4,
      shape: "square",
      errorCorrection: "M",
      colorScheme: {
        background: "#FFFFFF",
        foreground: "#000000",
      },
      ...defaultValues,
    },
  })

  return (
    <Form {...form}>
      <form onChange={form.handleSubmit(onChange)} className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>Basic Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="width"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Size</FormLabel>
                      <FormControl>
                        <Slider
                          min={100}
                          max={1000}
                          step={10}
                          value={[field.value]}
                          onValueChange={(value) => field.onChange(value[0])}
                        />
                      </FormControl>
                      <FormDescription>
                        {field.value}px × {field.value}px
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="margin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Margin</FormLabel>
                      <FormControl>
                        <Slider
                          min={0}
                          max={50}
                          step={1}
                          value={[field.value]}
                          onValueChange={(value) => field.onChange(value[0])}
                        />
                      </FormControl>
                      <FormDescription>{field.value}px</FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shape"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shape Style</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select shape style" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="square">Square</SelectItem>
                          <SelectItem value="rounded">Rounded</SelectItem>
                          <SelectItem value="dots">Dots</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="errorCorrection"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Error Correction</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select error correction" />
                          </SelectTrigger>
                          </FormControl>
                        <SelectContent>
                          <SelectItem value="L">Low (7%)</SelectItem>
                          <SelectItem value="M">Medium (15%)</SelectItem>
                          <SelectItem value="Q">Quartile (25%)</SelectItem>
                          <SelectItem value="H">High (30%)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Higher levels make the code more reliable but larger
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="colors">
            <Card>
              <CardHeader>
                <CardTitle>Color Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="colorScheme.background"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Background Color</FormLabel>
                        <FormControl>
                          <div className="flex gap-2">
                            <Input
                              type="color"
                              className="w-12 p-1 h-10"
                              {...field}
                            />
                            <Input
                              type="text"
                              value={field.value}
                              onChange={field.onChange}
                              className="font-mono"
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="colorScheme.foreground"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>QR Code Color</FormLabel>
                        <FormControl>
                          <div className="flex gap-2">
                            <Input
                              type="color"
                              className="w-12 p-1 h-10"
                              {...field}
                            />
                            <Input
                              type="text"
                              value={field.value}
                              onChange={field.onChange}
                              className="font-mono"
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="colorScheme.gradient"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <div className="flex items-center justify-between">
                        <FormLabel>Use Gradient</FormLabel>
                        <Switch
                          checked={!!field.value}
                          onCheckedChange={(checked) =>
                            field.onChange(
                              checked
                                ? {
                                    type: "linear",
                                    start: form.getValues("colorScheme.foreground"),
                                    end: "#000000",
                                  }
                                : undefined
                            )
                          }
                        />
                      </div>

                      {field.value && (
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="colorScheme.gradient.type"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Gradient Type</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select gradient type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="linear">Linear</SelectItem>
                                    <SelectItem value="radial">Radial</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormItem>
                            )}
                          />

                          <div className="grid gap-4 sm:grid-cols-2">
                            <FormField
                              control={form.control}
                              name="colorScheme.gradient.start"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Start Color</FormLabel>
                                  <FormControl>
                                    <div className="flex gap-2">
                                      <Input
                                        type="color"
                                        className="w-12 p-1 h-10"
                                        {...field}
                                      />
                                      <Input
                                        type="text"
                                        value={field.value}
                                        onChange={field.onChange}
                                        className="font-mono"
                                      />
                                    </div>
                                  </FormControl>
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="colorScheme.gradient.end"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>End Color</FormLabel>
                                  <FormControl>
                                    <div className="flex gap-2">
                                      <Input
                                        type="color"
                                        className="w-12 p-1 h-10"
                                        {...field}
                                      />
                                      <Input
                                        type="text"
                                        value={field.value}
                                        onChange={field.onChange}
                                        className="font-mono"
                                      />
                                    </div>
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>

                          {field.value.type === "linear" && (
                            <FormField
                              control={form.control}
                              name="colorScheme.gradient.direction"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Direction (degrees)</FormLabel>
                                  <FormControl>
                                    <Slider
                                      min={0}
                                      max={360}
                                      step={1}
                                      value={[field.value || 0]}
                                      onValueChange={(value) =>
                                        field.onChange(value[0])
                                      }
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    {field.value || 0}°
                                  </FormDescription>
                                </FormItem>
                              )}
                            />
                          )}
                        </div>
                      )}
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="logo"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <div className="flex items-center justify-between">
                        <FormLabel>Add Logo</FormLabel>
                        <Switch
                          checked={!!field.value}
                          onCheckedChange={(checked) =>
                            field.onChange(
                              checked
                                ? {
                                    image: "",
                                    size: 50,
                                    margin: 5,
                                  }
                                : undefined
                            )
                          }
                        />
                      </div>

                      {field.value && (
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="logo.image"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Logo Image</FormLabel>
                                <FormControl>
                                  <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={async (e) => {
                                      const file = e.target.files?.[0]
                                      if (file) {
                                        const reader = new FileReader()
                                        reader.onload = () => {
                                          field.onChange(reader.result as string)
                                        }
                                        reader.readAsDataURL(file)
                                      }
                                    }}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />

                          <div className="grid gap-4 sm:grid-cols-2">
                            <FormField
                              control={form.control}
                              name="logo.size"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Logo Size</FormLabel>
                                  <FormControl>
                                    <Slider
                                      min={20}
                                      max={150}
                                      step={1}
                                      value={[field.value]}
                                      onValueChange={(value) =>
                                        field.onChange(value[0])
                                      }
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    {field.value}px
                                  </FormDescription>
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="logo.margin"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Logo Margin</FormLabel>
                                  <FormControl>
                                    <Slider
                                      min={0}
                                      max={20}
                                      step={1}
                                      value={[field.value]}
                                      onValueChange={(value) =>
                                        field.onChange(value[0])
                                      }
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    {field.value}px
                                  </FormDescription>
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      )}
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  )
}