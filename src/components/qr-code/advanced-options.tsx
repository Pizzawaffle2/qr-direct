"use client"

import { useState } from "react"
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
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Info } from "lucide-react"

const advancedOptionsSchema = z.object({
  cornerStyle: z.object({
    cornerType: z.enum(["square", "rounded", "dots", "extra-rounded"]),
    cornerDotStyle: z.enum(["square", "dots"]),
    cornerSquareStyle: z.enum(["square", "extra-rounded"]),
  }),
  dotStyle: z.object({
    dotType: z.enum(["square", "dots", "classy", "classy-rounded"]),
    dotScale: z.number().min(0).max(100),
  }),
  pixelStyle: z.enum(["square", "rounded", "dots"]),
  frame: z.object({
    enabled: z.boolean(),
    style: z.enum(["standard", "classic", "modern"]),
    text: z.string().optional(),
    textColor: z.string(),
  }),
  effects: z.object({
    shadow: z.boolean(),
    glowAmount: z.number().min(0).max(100),
    opacity: z.number().min(0).max(100),
  }),
})

type AdvancedOptionsValues = z.infer<typeof advancedOptionsSchema>

interface AdvancedOptionsProps {
  defaultValues?: Partial<AdvancedOptionsValues>
  onChange: (values: AdvancedOptionsValues) => void
}

export function AdvancedOptions({ defaultValues, onChange }: AdvancedOptionsProps) {
  const [showPreview, setShowPreview] = useState(false)

  const form = useForm<AdvancedOptionsValues>({
    resolver: zodResolver(advancedOptionsSchema),
    defaultValues: {
      cornerStyle: {
        cornerType: "square",
        cornerDotStyle: "square",
        cornerSquareStyle: "square",
      },
      dotStyle: {
        dotType: "square",
        dotScale: 100,
      },
      pixelStyle: "square",
      frame: {
        enabled: false,
        style: "standard",
        textColor: "#000000",
      },
      effects: {
        shadow: false,
        glowAmount: 0,
        opacity: 100,
      },
      ...defaultValues,
    },
  })

  return (
    <Form {...form}>
      <form onChange={form.handleSubmit(onChange)} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Corner Style</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="cornerStyle.cornerType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Corner Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select corner type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="square">Square</SelectItem>
                      <SelectItem value="rounded">Rounded</SelectItem>
                      <SelectItem value="dots">Dots</SelectItem>
                      <SelectItem value="extra-rounded">Extra Rounded</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cornerStyle.cornerDotStyle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Corner Dot Style</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select dot style" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="square">Square</SelectItem>
                      <SelectItem value="dots">Dots</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Dot Style</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="dotStyle.dotType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dot Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select dot type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="square">Square</SelectItem>
                      <SelectItem value="dots">Dots</SelectItem>
                      <SelectItem value="classy">Classy</SelectItem>
                      <SelectItem value="classy-rounded">Classy Rounded</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dotStyle.dotScale"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dot Scale</FormLabel>
                  <FormControl>
                    <Slider
                      min={0}
                      max={100}
                      step={1}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                  </FormControl>
                  <FormDescription>{field.value}%</FormDescription>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Frame</h3>
          <FormField
            control={form.control}
            name="frame.enabled"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <FormLabel>Enable Frame</FormLabel>
                  <FormDescription>
                    Add a decorative frame around the QR code
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {form.watch("frame.enabled") && (
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="frame.style"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frame Style</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frame style" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="classic">Classic</SelectItem>
                        <SelectItem value="modern">Modern</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="frame.text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frame Text</FormLabel>
                    <FormControl>
                      <Input placeholder="Scan me!" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Effects</h3>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="effects.shadow"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel>Enable Shadow</FormLabel>
                    <FormDescription>
                      Add a subtle shadow effect
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="effects.glowAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Glow Effect</FormLabel>
                  <FormControl>
                    <Slider
                      min={0}
                      max={100}
                      step={1}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                  </FormControl>
                  <FormDescription>{field.value}%</FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="effects.opacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Opacity</FormLabel>
                  <FormControl>
                    <Slider
                      min={0}
                      max={100}
                      step={1}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                  </FormControl>
                  <FormDescription>{field.value}%</FormDescription>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? "Hide" : "Show"} Live Preview
          </Button>
        </div>
      </form>
    </Form>
  )
}